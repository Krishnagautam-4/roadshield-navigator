import type { RiskLevel } from "@/lib/roadshield";
import { riskVar } from "@/lib/roadshield";
import { cn } from "@/lib/utils";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: riskVar[level] }} />
      {level} Risk
    </span>
  );
}
