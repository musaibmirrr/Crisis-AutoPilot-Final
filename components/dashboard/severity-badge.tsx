import { cn } from "@/lib/utils"

type Severity = "low" | "medium" | "high"

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

const severityConfig: Record<
  Severity,
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className: "bg-success/10 text-success border-success/20",
  },
  medium: {
    label: "Medium",
    className: "bg-warning/10 text-warning-foreground border-warning/30",
  },
  high: {
    label: "High",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
