import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 gap-2",
  {
    variants: {
      variant: {
        // Employee variants (Green)
        employee:
          "bg-employee-primary text-primary-foreground hover:bg-employee-primary/90 shadow-lg shadow-employee-primary/20",
        "employee-outline": "border border-employee-primary/50 text-employee-primary hover:bg-employee-primary/10",
        "employee-ghost": "text-employee-primary hover:bg-employee-primary/10",

        consultant: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20",
        "consultant-outline": "border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10",
        "consultant-ghost": "text-indigo-400 hover:bg-indigo-500/10",

        // Neutral variants
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-transparent hover:bg-secondary/50",
        ghost: "hover:bg-secondary/50",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const GreenPathButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
GreenPathButton.displayName = "GreenPathButton"

export { GreenPathButton, buttonVariants }
