import type * as React from "react"
import { cn } from "@/lib/utils"

interface HeroProps {
  title: string
  description?: string
  variant?: "employee" | "consultant"
  children?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
}

export function GreenPathHero({
  title,
  description,
  variant = "employee",
  children,
  rightContent,
  className,
}: HeroProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 md:p-8",
        variant === "employee"
          ? "bg-gradient-to-br from-employee-primary/20 via-employee-primary/10 to-transparent border border-employee-primary/20"
          : "bg-gradient-to-br from-consultant-start/20 via-consultant-end/10 to-transparent border border-consultant-start/20",
        className,
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1
            className={cn(
              "text-2xl md:text-3xl font-bold",
              variant === "employee" ? "text-employee-primary" : "gradient-consultant-text",
            )}
          >
            {title}
          </h1>
          {description && <p className="text-muted-foreground text-sm md:text-base">{description}</p>}
          {children}
        </div>
        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>
    </div>
  )
}
