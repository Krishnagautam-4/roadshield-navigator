import { Link } from "@tanstack/react-router";
import { Github, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">
              RoadShield <span className="text-primary">India</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Visualizing accident hotspots across India for safer roads. An educational, frontend-only
            project built with realistic mock data — designed to be swapped with official datasets.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/map" className="transition-colors hover:text-primary">Interactive Map</Link></li>
            <li><Link to="/dashboard" className="transition-colors hover:text-primary">Analytics Dashboard</Link></li>
            <li><Link to="/safety" className="transition-colors hover:text-primary">Road Safety Tips</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-primary">About the Project</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Emergency</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>National Helpline — <span className="font-semibold text-foreground">112</span></li>
            <li>Ambulance — <span className="font-semibold text-foreground">108</span></li>
            <li>Highway Aid — <span className="font-semibold text-foreground">1033</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <p>© 2026 RoadShield India · Educational & portfolio project · Mock data only</p>
          <p className="inline-flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" /> Built with React, TypeScript & Leaflet
          </p>
        </div>
      </div>
    </footer>
  );
}
