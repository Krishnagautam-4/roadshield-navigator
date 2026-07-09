import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { MapSkeleton } from "@/components/Skeletons";
import { useHydrated } from "@/hooks/useHydrated";
import { geoQuery, indexQuery, RISK_ORDER, riskVar } from "@/lib/roadshield";

const IndiaMap = lazy(() => import("@/components/map/IndiaMap"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive India Map — RoadShield India" },
      {
        name: "description",
        content: "Click any Indian state to explore its accident hotspots, risk levels and safety analytics.",
      },
      { property: "og:title", content: "Interactive India Map — RoadShield India" },
      { property: "og:description", content: "Click any Indian state to explore its accident hotspots and risk levels." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { data: geo } = useQuery(geoQuery);
  const { data: index } = useQuery(indexQuery);

  const ready = hydrated && geo && index;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Interactive India Map</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Darker amber states record more accidents. Hover a state to preview its numbers, click it to open
          the full state report with hotspot markers.
        </p>
      </motion.div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-wide">Hotspot risk legend</span>
        {RISK_ORDER.map((r) => (
          <span key={r} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskVar[r] }} />
            {r}
          </span>
        ))}
      </div>

      <div className="mt-6 h-[70vh] min-h-[420px] overflow-hidden rounded-2xl border border-border shadow-soft">
        {ready ? (
          <Suspense fallback={<MapSkeleton />}>
            <IndiaMap
              geo={geo}
              states={index.states}
              onStateClick={(slug) => navigate({ to: "/states/$slug", params: { slug } })}
            />
          </Suspense>
        ) : (
          <MapSkeleton />
        )}
      </div>

      {index && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">Jump to a state</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...index.states]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((s) => (
                <button
                  key={s.slug}
                  onClick={() => navigate({ to: "/states/$slug", params: { slug: s.slug } })}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  {s.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
