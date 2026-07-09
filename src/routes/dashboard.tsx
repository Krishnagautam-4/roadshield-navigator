import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FilterX, Flame, Gauge, MapPin, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts";
import { ChartGridSkeleton, StatRowSkeleton } from "@/components/Skeletons";
import { StatCard } from "@/components/StatCard";
import {
  formatNumber,
  indexQuery,
  nationalQuery,
  SEVERITIES,
  stateQuery,
  VEHICLE_TYPES,
  YEARS,
  type Analytics,
  type Hotspot,
} from "@/lib/roadshield";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard — RoadShield India" },
      {
        name: "description",
        content:
          "Filterable road accident analytics for India — vehicle types, severity, yearly trends, dangerous districts and road types.",
      },
      { property: "og:title", content: "Analytics Dashboard — RoadShield India" },
      { property: "og:description", content: "Filterable road accident analytics across Indian states." },
    ],
  }),
  component: Dashboard,
});

const ALL = "all";

function buildAnalytics(
  hotspots: Hotspot[],
  allHotspots: Hotspot[],
  base: Analytics,
  year: string,
): Analytics {
  const weight = (h: Hotspot) => (year === ALL ? h.accidents : (h.yearly[year] ?? 0) * 6);
  const group = (key: (h: Hotspot) => string) => {
    const out: Record<string, number> = {};
    for (const h of hotspots) out[key(h)] = (out[key(h)] ?? 0) + weight(h);
    return out;
  };
  const total = hotspots.reduce((a, h) => a + weight(h), 0);
  const allTotal = Math.max(1, allHotspots.reduce((a, h) => a + h.accidents, 0));
  // Share of the full dataset represented by the filtered hotspots.
  const share = Math.min(1, total / allTotal);

  const yearly = YEARS.map((y) => {
    const acc = hotspots.reduce((a, h) => a + (h.yearly[y] ?? 0), 0);
    const fat = hotspots.reduce((a, h) => a + h.fatalities * ((h.yearly[y] ?? 0) / Math.max(1, h.accidents)), 0);
    return { year: Number(y), accidents: acc, fatalities: Math.round(fat) };
  });

  const districts = group((h) => (h.state ? `${h.district} (${h.state})` : h.district));

  return {
    vehicleType: Object.fromEntries(VEHICLE_TYPES.map((v) => [v, 0]).concat(Object.entries(group((h) => h.vehicleType)))),
    severity: group((h) => h.severity),
    roadType: group((h) => h.roadType),
    yearly,
    monthly: base.monthly.map((m) => ({
      month: m.month,
      accidents: Math.round(m.accidents * share),
    })),
    topDistricts: Object.entries(districts)
      .map(([district, accidents]) => ({ district, accidents }))
      .sort((a, b) => b.accidents - a.accidents)
      .slice(0, 10),
  };
}

function Dashboard() {
  const [stateSlug, setStateSlug] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [vehicle, setVehicle] = useState(ALL);
  const [severity, setSeverity] = useState(ALL);
  const [district, setDistrict] = useState(ALL);

  const { data: index } = useQuery(indexQuery);
  const { data: national } = useQuery(nationalQuery);
  const { data: stateData } = useQuery({ ...stateQuery(stateSlug), enabled: stateSlug !== ALL });

  const source = stateSlug === ALL ? national : stateData;
  const districts = useMemo(() => {
    if (stateSlug === ALL) return [];
    return index?.states.find((s) => s.slug === stateSlug)?.districts ?? [];
  }, [index, stateSlug]);

  const filtered = useMemo(() => {
    if (!source) return [];
    return source.hotspots.filter(
      (h) =>
        (vehicle === ALL || h.vehicleType === vehicle) &&
        (severity === ALL || h.severity === severity) &&
        (district === ALL || h.district === district) &&
        (year === ALL || (h.yearly[year] ?? 0) > 0),
    );
  }, [source, vehicle, severity, district, year]);

  const analytics = useMemo(() => {
    if (!source) return null;
    const noFilters = vehicle === ALL && severity === ALL && district === ALL && year === ALL;
    if (noFilters) return source.analytics;
    return buildAnalytics(filtered, source.analytics, year);
  }, [source, filtered, vehicle, severity, district, year]);

  const hasFilters = vehicle !== ALL || severity !== ALL || district !== ALL || year !== ALL || stateSlug !== ALL;
  const totals = analytics
    ? {
        accidents: Object.values(analytics.severity).reduce((a, b) => a + b, 0),
        fatal: analytics.severity["Fatal"] ?? 0,
      }
    : null;

  const reset = () => {
    setStateSlug(ALL);
    setYear(ALL);
    setVehicle(ALL);
    setSeverity(ALL);
    setDistrict(ALL);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Analytics Dashboard</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Slice India's accident data by region, year, vehicle type, severity and district. Charts update
          instantly on the client.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="glass-card mt-6 rounded-2xl p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            label="Region"
            value={stateSlug}
            onChange={(v) => {
              setStateSlug(v);
              setDistrict(ALL);
            }}
            options={[
              { value: ALL, label: "All India" },
              ...(index?.states ?? [])
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => ({ value: s.slug, label: s.name })),
            ]}
          />
          <FilterSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={[{ value: ALL, label: "All years" }, ...YEARS.map((y) => ({ value: y, label: y }))]}
          />
          <FilterSelect
            label="Vehicle type"
            value={vehicle}
            onChange={setVehicle}
            options={[{ value: ALL, label: "All vehicles" }, ...VEHICLE_TYPES.map((v) => ({ value: v, label: v }))]}
          />
          <FilterSelect
            label="Severity"
            value={severity}
            onChange={setSeverity}
            options={[{ value: ALL, label: "All severities" }, ...SEVERITIES.map((s) => ({ value: s, label: s }))]}
          />
          <FilterSelect
            label="District"
            value={district}
            onChange={setDistrict}
            disabled={stateSlug === ALL}
            placeholder={stateSlug === ALL ? "Pick a region first" : undefined}
            options={[{ value: ALL, label: "All districts" }, ...districts.map((d) => ({ value: d, label: d }))]}
          />
        </div>
        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-muted-foreground">
              <FilterX className="h-4 w-4" /> Reset filters
            </Button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6">
        {totals && source ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={TriangleAlert} label="Accidents in view" value={formatNumber(totals.accidents)} index={0} />
            <StatCard icon={Flame} label="Fatal accidents" value={formatNumber(totals.fatal)} index={1} />
            <StatCard icon={MapPin} label="Matching hotspots" value={String(filtered.length)} index={2} />
            <StatCard
              icon={Gauge}
              label="Fatality share"
              value={totals.accidents ? `${Math.round((totals.fatal / totals.accidents) * 100)}%` : "—"}
              index={3}
            />
          </div>
        ) : (
          <StatRowSkeleton />
        )}
      </div>

      {/* Charts */}
      <div className="mt-8">
        {!analytics ? (
          <ChartGridSkeleton />
        ) : filtered.length === 0 && hasFilters ? (
          <div className="glass-card flex flex-col items-center rounded-2xl px-6 py-20 text-center">
            <FilterX className="h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-bold">No records match these filters</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try widening the year range or clearing the vehicle, severity or district filters.
            </p>
            <Button className="mt-6" onClick={reset}>
              Reset all filters
            </Button>
          </div>
        ) : (
          <AnalyticsCharts analytics={analytics} />
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder ?? label} />
        </SelectTrigger>
        <SelectContent className="z-[1300] max-h-72">
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
