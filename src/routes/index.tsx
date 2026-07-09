import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Car, Flame, Landmark, Map as MapIcon, ShieldCheck, TriangleAlert } from "lucide-react";
import heroImage from "@/assets/hero-highway.jpg";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatRowSkeleton } from "@/components/Skeletons";
import { formatNumber, indexQuery, VEHICLE_TYPES } from "@/lib/roadshield";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoadShield India — Visualizing Accident Hotspots for Safer Roads" },
      {
        name: "description",
        content:
          "Explore accident hotspots across every Indian state with interactive maps, analytics dashboards and road safety insights.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: MapIcon,
    title: "Interactive India Map",
    text: "Every state is clickable. Hover to preview accident stats, click to dive into a dedicated state page.",
    to: "/map",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    text: "Six animated charts with live filters for year, vehicle type, severity and district.",
    to: "/dashboard",
  },
  {
    icon: ShieldCheck,
    title: "Road Safety Hub",
    text: "Practical safety guidance, driving tips for rain, fog and night, plus emergency helplines.",
    to: "/safety",
  },
] as const;

function Landing() {
  const { data } = useQuery(indexQuery);
  const totals = data
    ? {
        states: data.states.length,
        hotspots: data.states.reduce((a, s) => a + s.hotspots, 0),
        accidents: data.states.reduce((a, s) => a + s.totalAccidents, 0),
      }
    : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-surface">
        <img
          src={heroImage}
          alt="Aerial night view of an illuminated Indian highway interchange"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <TriangleAlert className="h-3.5 w-3.5" />
              Road safety intelligence for India
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl dark:text-foreground">
              RoadShield <span className="gradient-text">India</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Visualizing Accident Hotspots Across India for Safer Roads.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 shadow-glow">
                <Link to="/map">
                  Explore the Map <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="backdrop-blur">
                <Link to="/dashboard">View Analytics</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-14 max-w-7xl px-4 sm:px-6">
        {totals ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Landmark} label="States & UTs" value={String(totals.states)} hint="Every region covered" index={0} />
            <StatCard icon={Flame} label="Accident Hotspots" value={String(totals.hotspots)} hint="Mapped with risk levels" index={1} />
            <StatCard icon={TriangleAlert} label="Accident Records" value={formatNumber(totals.accidents)} hint="2019 – 2024 mock data" index={2} />
            <StatCard icon={Car} label="Vehicle Categories" value={String(VEHICLE_TYPES.length)} hint="Car, Bike, Bus, Truck…" index={3} />
          </div>
        ) : (
          <StatRowSkeleton />
        )}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            From hotspots to insight
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built like a modern mapping product — explore where accidents cluster, why they happen, and
            what makes each state's roads risky.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={f.to}
                className="group flex h-full flex-col glass-card rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top states strip */}
      {data && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Highest-risk states</h2>
                <p className="mt-1 text-sm text-muted-foreground">Ranked by total recorded accidents</p>
              </div>
              <Button asChild variant="ghost" className="gap-1.5 text-primary">
                <Link to="/map">
                  See full map <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...data.states]
                .sort((a, b) => b.totalAccidents - a.totalAccidents)
                .slice(0, 6)
                .map((s, i) => (
                  <Link
                    key={s.slug}
                    to="/states/$slug"
                    params={{ slug: s.slug }}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 transition-colors hover:border-primary/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        <span className="mr-2 font-display text-primary">{String(i + 1).padStart(2, "0")}</span>
                        {s.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(s.totalAccidents)} accidents · severity index {s.severityIndex}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
