import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  index?: number;
}

export function ChartCard({ title, icon: Icon, children, className, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className={cn("glass-card rounded-2xl p-5", className)}
    >
      <div className="mb-4 flex items-center gap-2.5">
        {Icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <h3 className="min-w-0 truncate font-display text-sm font-semibold">{title}</h3>
      </div>
      <div className="h-64">{children}</div>
    </motion.div>
  );
}

export const chartTooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--popover-foreground)",
  fontSize: "12px",
  boxShadow: "var(--shadow-soft)",
} as const;

export const chartAxisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;
