import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: {
    value: number
    isPositive?: boolean
  }
  variant?: "default" | "employee" | "consultant"
  className?: string
}

export function GreenPathStatCard({ label, value, subValue, trend, variant = "default", className }: StatCardProps) {
  const bgVariants = {
    default: "bg-card/80",
    employee: "bg-employee-primary/10 border-employee-primary/20",
    consultant: "bg-gradient-to-br from-consultant-start/10 to-consultant-end/10 border-consultant-start/20",
  }

  const valueVariants = {
    default: "text-foreground",
    employee: "text-employee-primary",
    consultant: "gradient-consultant-text",
  }

  return (
    <div className={cn("rounded-xl border p-4 transition-all", bgVariants[variant], className)}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold", valueVariants[variant])}>{value}</span>
        {subValue && <span className="text-sm text-muted-foreground">{subValue}</span>}
      </div>
      {trend && (
        <div
          className={cn("mt-2 flex items-center gap-1 text-xs", trend.isPositive ? "text-green-400" : "text-red-400")}
        >
          {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  )
}
