import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] font-orbitron",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl",
        destructive:
          "bg-destructive text-white shadow-lg hover:bg-destructive/90",
        outline:
          "border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Modern neon variants
        "neon-pink": "bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 border-2 border-neon-pink text-neon-pink hover:from-neon-pink/30 hover:to-neon-purple/30 neon-glow-pink font-semibold tracking-wide backdrop-blur-sm",
        "neon-cyan": "bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border-2 border-neon-cyan text-neon-cyan hover:from-neon-cyan/30 hover:to-neon-blue/30 neon-glow-cyan font-semibold tracking-wide backdrop-blur-sm",
        "neon-purple": "bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border-2 border-neon-purple text-neon-purple hover:from-neon-purple/30 hover:to-neon-pink/30 neon-glow-purple font-semibold tracking-wide backdrop-blur-sm",
        "neon-green": "bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green text-neon-green hover:from-neon-green/30 hover:to-neon-cyan/30 neon-glow-green font-semibold tracking-wide backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
