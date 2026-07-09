import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Database, Layers, ShieldAlert, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — RoadShield India" },
      {
        name: "description",
        content:
          "Why RoadShield India exists, the frontend technology stack behind it, and its future scope with official government road accident datasets.",
      },
      { property: "og:title", content: "About the Project — RoadShield India" },
      { property: "og:description", content: "The purpose, stack and future scope of RoadShield India." },
    ],
  }),
  component: AboutPage,
});

const stack = [
  ["React 19 + TypeScript", "Component architecture with strict typing"],
  ["TanStack Router", "Type-safe file-based routing & navigation"],
  ["Tailwind CSS v4", "Token-driven design system, dark & light themes"],
  ["shadcn/ui", "Accessible primitives — dialogs, selects, command palette"],
  ["React Leaflet", "Interactive India choropleth & hotspot maps"],
  ["Recharts", "Animated bar, pie, line, area & donut charts"],
  ["Framer Motion", "Scroll-triggered and page transitions"],
  ["Static JSON data", "Per-state files in /public/data, backend-free"],
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">About RoadShield India</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A frontend-only, portfolio-grade exploration of how design and data visualization can make road
          safety tangible.
        </p>
      </motion.div>

      <div className="mt-10 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          <h2 className="inline-flex items-center gap-2.5 font-display text-xl font-bold">
            <Target className="h-5 w-5 text-primary" /> Purpose
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            India records among the highest road accident fatalities in the world. Numbers in spreadsheets
            rarely change behavior — maps and charts can. RoadShield India turns accident data into an
            explorable experience: click a state, see where crashes cluster, understand why they happen, and
            learn what prevents them. It is built for education and portfolio demonstration, using realistic
            mock data throughout.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          <h2 className="inline-flex items-center gap-2.5 font-display text-xl font-bold">
            <Layers className="h-5 w-5 text-primary" /> Technology stack
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {stack.map(([name, desc]) => (
              <div key={name} className="rounded-xl bg-secondary p-4">
                <dt className="font-semibold">{name}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{desc}</dd>
              </div>
            ))}
          </dl>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          <h2 className="inline-flex items-center gap-2.5 font-display text-xl font-bold">
            <ShieldAlert className="h-5 w-5 text-primary" /> Why road safety matters
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Every road death is preventable. Overspeeding, riding without helmets, skipping seat belts and
            distracted driving account for the overwhelming majority of fatalities. Awareness at the level of
            <em> specific places</em> — the junction you cross daily, the highway stretch on your commute —
            is far more actionable than national statistics. That is the visualization philosophy behind this
            project.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          <h2 className="inline-flex items-center gap-2.5 font-display text-xl font-bold">
            <Database className="h-5 w-5 text-primary" /> Future scope
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            All data lives in static JSON files under <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">/public/data</code>,
            organized per state with an identical schema. Swapping the mock data for official datasets — MoRTH's
            "Road Accidents in India" annual reports, NCRB accident records, or state police open data — requires
            no code changes, only new JSON. Planned extensions include route-level risk scoring, time-of-day
            heatmaps and offline PWA support.
          </p>
        </motion.section>
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="gap-2 shadow-glow">
          <Link to="/map">
            Start exploring <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
