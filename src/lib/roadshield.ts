import { queryOptions } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type Severity = "Minor" | "Major" | "Fatal";

export interface Hotspot {
  id: string;
  location: string;
  district: string;
  lat: number;
  lng: number;
  accidents: number;
  fatalities: number;
  majorCause: string;
  vehicleType: string;
  roadType: string;
  riskLevel: RiskLevel;
  safetyTip: string;
  severity: Severity;
  yearly: Record<string, number>;
  state?: string;
  stateSlug?: string;
}

export interface YearPoint {
  year: number;
  accidents: number;
  fatalities: number;
}

export interface Analytics {
  vehicleType: Record<string, number>;
  severity: Record<string, number>;
  yearly: YearPoint[];
  monthly: { month: string; accidents: number }[];
  topDistricts: { district: string; accidents: number }[];
  roadType: Record<string, number>;
}

export interface StateSummary {
  name: string;
  slug: string;
  type: string;
  center: [number, number];
  totalAccidents: number;
  fatalAccidents: number;
  hotspots: number;
  severityIndex: number;
  highRiskDistricts: number;
  districts: string[];
}

export interface StateData {
  name: string;
  slug: string;
  type: string;
  center: [number, number];
  totalAccidents: number;
  fatalAccidents: number;
  highRiskDistricts: number;
  severityIndex: number;
  districts: string[];
  hotspots: Hotspot[];
  analytics: Analytics;
}

export interface NationalData {
  name: string;
  hotspots: Hotspot[];
  analytics: Analytics;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json() as Promise<T>;
}

export const indexQuery = queryOptions({
  queryKey: ["rs", "index"],
  queryFn: () => fetchJson<{ states: StateSummary[] }>("/data/index.json"),
  staleTime: Infinity,
});

export const stateQuery = (slug: string) =>
  queryOptions({
    queryKey: ["rs", "state", slug],
    queryFn: () => fetchJson<StateData>(`/data/states/${slug}.json`),
    staleTime: Infinity,
  });

export const nationalQuery = queryOptions({
  queryKey: ["rs", "national"],
  queryFn: () => fetchJson<NationalData>("/data/national.json"),
  staleTime: Infinity,
});

export const geoQuery = queryOptions({
  queryKey: ["rs", "geo"],
  queryFn: () => fetchJson<FeatureCollection>("/geo/india-states.geojson"),
  staleTime: Infinity,
});

export const RISK_ORDER: RiskLevel[] = ["Low", "Moderate", "High", "Critical"];

export const riskVar: Record<RiskLevel, string> = {
  Low: "var(--risk-low)",
  Moderate: "var(--risk-moderate)",
  High: "var(--risk-high)",
  Critical: "var(--risk-critical)",
};

export const VEHICLE_TYPES = ["Car", "Bike", "Bus", "Truck", "Auto", "Others"];
export const SEVERITIES: Severity[] = ["Minor", "Major", "Fatal"];
export const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"];

export function formatNumber(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString("en-IN");
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
