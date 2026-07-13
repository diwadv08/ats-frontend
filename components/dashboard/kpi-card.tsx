/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — KPI Card Component
 * Animated metric card with trend indicator and icon.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
};

const colorMap: Record<string, string> = {
  emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  purple: "from-purple-500/20 to-purple-600/10 text-purple-600 dark:text-purple-400",
  amber: "from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400",
  teal: "from-teal-500/20 to-teal-600/10 text-teal-600 dark:text-teal-400",
  rose: "from-rose-500/20 to-rose-600/10 text-rose-600 dark:text-rose-400",
  orange: "from-orange-500/20 to-orange-600/10 text-orange-600 dark:text-orange-400",
};

interface KpiCardProps {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
  index?: number;
}

export function KpiCard({
  label,
  value,
  change,
  trend,
  icon,
  color,
  index = 0,
}: KpiCardProps) {
  const Icon = iconMap[icon] || Users;
  const colorClass = colorMap[color] || colorMap.emerald;

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : trend === "down"
      ? "text-rose-600 dark:text-rose-400"
      : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 cursor-default group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            className="text-3xl font-bold tracking-tight"
          >
            {value}
          </motion.p>
          <div className="flex items-center gap-1.5">
            <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
            <span className={cn("text-xs font-semibold", trendColor)}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-[var(--shadow-sm)] transition-transform group-hover:scale-110",
            colorClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
