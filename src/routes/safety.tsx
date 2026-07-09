import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Beer,
  CloudRain,
  Gauge,
  HardHat,
  Moon,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Road Safety Tips & Helplines — RoadShield India" },
      {
        name: "description",
        content:
          "Essential road safety guidance for India — helmets, seat belts, speed, drink driving, rain and night driving, plus emergency helplines.",
      },
      { property: "og:title", content: "Road Safety Tips & Helplines — RoadShield India" },
      { property: "og:description", content: "Essential road safety guidance and emergency helplines for Indian roads." },
    ],
  }),
  component: SafetyPage,
});

const tips = [
  {
    icon: HardHat,
    title: "Wear a Helmet",
    text: "ISI-marked helmets reduce the risk of fatal head injury by nearly 70%. Strap it properly — an unfastened helmet offers no protection. Pillion riders need helmets too.",
  },
  {
    icon: ShieldCheck,
    title: "Wear Your Seat Belt",
    text: "Seat belts cut the risk of death for front-seat occupants by 45–50%. Buckle up before moving, and ensure rear passengers do the same — rear belts save lives too.",
  },
  {
    icon: Gauge,
    title: "Avoid Overspeeding",
    text: "Overspeeding is the single largest cause of road deaths in India. Braking distance grows with the square of your speed — 60→80 km/h nearly doubles it.",
  },
  {
    icon: Beer,
    title: "Don't Drink & Drive",
    text: "Alcohol slows reaction time, blurs judgement and narrows vision. Even one drink impairs driving. Use a cab, public transport or a designated sober driver.",
  },
  {
    icon: Smartphone,
    title: "No Mobile While Driving",
    text: "Reading one message takes your eyes off the road for ~5 seconds — at 60 km/h that's 80+ metres driven blind. Put the phone away or use Do Not Disturb mode.",
  },
  {
    icon: CloudRain,
    title: "Rain Driving Tips",
    text: "Slow down, double your following distance and brake gently to avoid aquaplaning. Use wipers and low-beam headlights; avoid waterlogged stretches and painted lane markings.",
  },
  {
    icon: Moon,
    title: "Night Driving Tips",
    text: "Use high beams only on empty roads and dip them for oncoming traffic. Keep your windscreen clean, watch for unlit vehicles and pedestrians, and take breaks to fight fatigue.",
  },
  {
    icon: Phone,
    title: "Know the Helplines",
    text: "Save emergency numbers before you travel. Report accidents immediately — the Good Samaritan law protects those who help crash victims in India.",
  },
];

const helplines = [
  { label: "National Emergency", number: "112" },
  { label: "Ambulance", number: "108" },
  { label: "Highway Assistance", number: "1033" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Women's Helpline", number: "1091" },
];

function SafetyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Road Safety Hub</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Most road deaths are preventable. These habits — backed by crash data — are the highest-impact
          things any driver or rider in India can do today.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((t, i) => (
          <motion.article
            key={t.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            className="glass-card flex flex-col rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <t.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-base font-semibold">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
          </motion.article>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 overflow-hidden rounded-3xl hero-surface p-8 sm:p-10"
      >
        <h2 className="font-display text-2xl font-bold tracking-tight text-primary-foreground dark:text-foreground">
          <span className="text-primary">Emergency</span> helpline numbers
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Available 24×7 across India. In a crash, call first — then move victims only if the vehicle is unsafe.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {helplines.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="glass-card rounded-2xl p-4 text-center transition-transform hover:scale-[1.03]"
            >
              <p className="font-display text-2xl font-bold text-primary">{h.number}</p>
              <p className="mt-1 text-xs text-muted-foreground">{h.label}</p>
            </a>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
