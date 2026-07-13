/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Button Component (shadcn/ui style)
 * Premium button with glassmorphism and animation variants.
 * ─────────────────────────────────────────────────────────────
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        outline:
          "border border-input bg-background/40 shadow-[var(--shadow-xs)] hover:bg-accent/12 hover:text-foreground hover:shadow-[var(--shadow-sm)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "glass-card text-foreground hover:bg-white/90 dark:hover:bg-white/10",
        emerald:
          "bg-primary text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]",
        purple:
          "bg-secondary text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        amber:
          "bg-accent text-accent-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        rose:
          "bg-destructive text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        teal:
          "bg-primary text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]",
        orange:
          "bg-accent text-accent-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
