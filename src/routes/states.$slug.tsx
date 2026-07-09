import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import {
  Ambulance,
  ArrowLeft,
  Car,
  Flame,
  Gauge,
  Lightbulb,
  MapPin,
  Route as RouteIcon,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { StatCard } from "@/components/StatCard";
import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts";
import { ChartGridSkeleton, MapSkeleton, StatRowSkeleton } from "@/components/Skeletons";
import { useHydrated } from "@/hooks/useHydrated";
import { formatNumber, stateQuery, type Hotspot } from "@/lib/roadshield";

const StateHotspotMap = lazy(() => import("@/components/map/StateHotspotMap"));

export const Route = createFileRoute("/states/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} Accident Hotspots — RoadShield India` },
        {
          name: "description",
          content: `Accident hotspots, risk levels and road safety analytics for ${name}, India.`,
        },
        { property: "og:title", content: `${name} Accident Hotspots — RoadShield India` },
        { property: "og:description", content: `Accident hotspots and safety analytics for ${name}.` },
      ],
    };
  },
  component: StatePage,
});

function StatePage() {
  const { slug } = Route.useParams();
  const hydrated = useHydrated();
  const { data: state, isError, isLoading } = useQuery(stateQuery(slug));
  const [selected, setSelected] = useState<Hotspot | null>(null);

  if (isError) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <TriangleAlert className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-2xl font-bold">State not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find data for this region. It may have been renamed or removed.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link to="/map">
            <ArrowLeft className="h-4 w-4" /> Back to India Map
          </Link>
        </Button>
      </div>
    );
  }

  const active = selected ?? state?.hotspots[0] ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/map"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> India Map
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-3 flex flex-wrap items-center gap-3"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {state?.name ?? "Loading…"}
        </h1>
        {state && (
          <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            {state.type}
          </span>
        )}
      </motion.div>

      {/* Overview cards */}
      <div className="mt-6">
        {state ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Car} label="Total Accidents" value={formatNumber(state.totalAccidents)} hint="2019 – 2024" index={0} />
            <StatCard icon={Flame} label="Fatal Accidents" value={formatNumber(state.fatalAccidents)} hint={`${Math.round((state.fatalAccidents / state.totalAccidents) * 100)}% of total`} index={1} />
            <StatCard icon={MapPin} label="High-Risk Districts" value={String(state.highRiskDistricts)} hint={`${state.hotspots.length} hotspots mapped`} index={2} />
            <StatCard icon={Gauge} label="Severity Index" value={`${state.severityIndex}/10`} hint={state.severityIndex >= 7 ? "Critical zone" : state.severityIndex >= 5 ? "Elevated" : "Manageable"} index={3} />
          </div>
        ) : (
          <StatRowSkeleton />
        )}
      </div>

      {/* Map + hotspot details */}
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-[480px] overflow-hidden rounded-2xl border border-border shadow-soft">
          {hydrated && state ? (
            <Suspense fallback={<MapSkeleton />}>
              <StateHotspotMap
                center={state.center}
                zoom={state.type === "State" ? 6 : 9}
                hotspots={state.hotspots}
                onSelect={setSelected}
              />
            </Suspense>
          ) : (
            <MapSkeleton />
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card flex flex-col rounded-2xl p-5"
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Hotspot details
          </h2>
          {active ? (
            <div className="mt-3 flex-1 space-y-4">
              <div>
                <p className="font-display text-lg font-bold leading-snug">{active.location}</p>
                <p className="mt-1 text-sm text-muted-foreground">{active.district} district</p>
              </div>
              <RiskBadge level={active.riskLevel} />
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-secondary p-3">
                  <dt className="text-xs text-muted-foreground">Accidents</dt>
                  <dd className="mt-0.5 font-display text-xl font-bold">{active.accidents}</dd>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <dt className="text-xs text-muted-foreground">Fatalities</dt>
                  <dd className="mt-0.5 font-display text-xl font-bold">{active.fatalities}</dd>
                </div>
                <div className="col-span-2 rounded-xl bg-secondary p-3">
                  <dt className="text-xs text-muted-foreground">Major cause</dt>
                  <dd className="mt-0.5 font-semibold">{active.majorCause}</dd>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <dt className="text-xs text-muted-foreground">Vehicle type</dt>
                  <dd className="mt-0.5 font-semibold">{active.vehicleType}</dd>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <dt className="text-xs text-muted-foreground">Road type</dt>
                  <dd className="mt-0.5 font-semibold">{active.roadType}</dd>
                </div>
              </dl>
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Lightbulb className="h-3.5 w-3.5" /> Road safety tip
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{active.safetyTip}</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <MapPin className="h-8 w-8 opacity-50" />
              <p className="mt-3">Click a marker on the map to inspect a hotspot.</p>
            </div>
          )}
        </motion.aside>
      </div>

      {/* Hotspot list */}
      {state && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold tracking-tight">All hotspots in {state.name}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setSelected(h);
                  window.scrollTo({ top: 320, behavior: "smooth" });
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  active?.id === h.id ? "border-primary/60 bg-primary/5" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="min-w-0 truncate text-sm font-semibold">{h.location}</p>
                  <RiskBadge level={h.riskLevel} className="shrink-0" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.district} · {h.accidents} accidents · {h.majorCause}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="mt-12">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-bold tracking-tight">State analytics</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <RouteIcon className="h-3.5 w-3.5" /> Mock data, 2019–2024
          </span>
        </div>
        <div className="mt-4">
          {state ? <AnalyticsCharts analytics={state.analytics} /> : <ChartGridSkeleton />}
        </div>
      </div>

      {isLoading && (
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Ambulance className="h-4 w-4 animate-pulse" /> Loading state data…
        </p>
      )}
    </div>
  );
}
