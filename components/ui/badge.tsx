/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Badge Component
 * Status badges with multi-color palette support.
 * ─────────────────────────────────────────────────────────────
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
        secondary: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
        destructive: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
        outline: "text-foreground border border-input",
        amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
        teal: "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300",
        orange: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
        slate: "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300",
        ghost: "bg-transparent text-muted-foreground border border-dashed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
