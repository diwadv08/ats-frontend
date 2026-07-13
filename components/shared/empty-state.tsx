/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — EmptyState Component
 * Polished empty state with illustration and action.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import { Search, FileX, Inbox, AlertCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "error" | "inbox";
  className?: string;
}

const variantConfig = {
  default: { icon: FileX, color: "text-muted-foreground" },
  search: { icon: Search, color: "text-amber-500" },
  error: { icon: AlertCircle, color: "text-rose-500" },
  inbox: { icon: Inbox, color: "text-emerald-500" },
};

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon: CustomIcon,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div
        className={cn(
          "mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 dark:bg-muted/20",
          config.color
        )}
      >
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="default">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
