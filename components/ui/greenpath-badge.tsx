import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", {
  variants: {
    variant: {
      // Employee variants
      employee: "bg-employee-primary/20 text-employee-primary border border-employee-primary/30",
      "employee-solid": "bg-employee-primary text-primary-foreground",

      consultant: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
      "consultant-solid": "bg-indigo-500 text-white",

      // Status variants
      success: "bg-green-500/20 text-green-400 border border-green-500/30",
      warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      error: "bg-red-500/20 text-red-400 border border-red-500/30",
      info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",

      // Neutral
      default: "bg-secondary text-secondary-foreground border border-border",
      outline: "border border-border text-muted-foreground",

      // Category badges (for news/reports)
      regulation: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      trend: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
      insight: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      case: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function GreenPathBadge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { GreenPathBadge, badgeVariants }
