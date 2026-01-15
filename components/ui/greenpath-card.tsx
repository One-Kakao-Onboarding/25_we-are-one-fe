import * as React from "react"
import { cn } from "@/lib/utils"

interface GreenPathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "employee" | "consultant" | "stat"
  hover?: boolean
}

const GreenPathCard = React.forwardRef<HTMLDivElement, GreenPathCardProps>(
  ({ className, variant = "default", hover = false, ...props }, ref) => {
    const variants = {
      default: "bg-card border-border/50",
      employee: "bg-card border-employee-primary/20 card-glow-green",
      consultant: "bg-card border-consultant-start/20 card-glow-purple",
      stat: "bg-card/80 border-border/30 backdrop-blur-sm",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-6 transition-all duration-200",
          variants[variant],
          hover && "hover:border-border hover:bg-card/80 cursor-pointer",
          className,
        )}
        {...props}
      />
    )
  },
)
GreenPathCard.displayName = "GreenPathCard"

const GreenPathCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />
  ),
)
GreenPathCardHeader.displayName = "GreenPathCardHeader"

const GreenPathCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  ),
)
GreenPathCardTitle.displayName = "GreenPathCardTitle"

const GreenPathCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
GreenPathCardDescription.displayName = "GreenPathCardDescription"

const GreenPathCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
GreenPathCardContent.displayName = "GreenPathCardContent"

export { GreenPathCard, GreenPathCardHeader, GreenPathCardTitle, GreenPathCardDescription, GreenPathCardContent }
