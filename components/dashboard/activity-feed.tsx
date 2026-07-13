/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Activity Feed Component
 * Animated timeline of recent activities.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  CalendarCheck,
  FileCheck,
  UserCheck,
  XCircle,
  MessageSquare,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityItem } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  applicant: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  interview: { icon: CalendarCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
  offer: { icon: FileCheck, color: "text-teal-500", bg: "bg-teal-500/10" },
  hire: { icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  rejection: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  note: { icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
  job: { icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
};

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Latest updates from your team
        </p>
      </div>
      <ScrollArea className="h-[340px] pr-4">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = typeConfig[activity.type] || typeConfig.note;
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-3 group"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.bg} ${config.color} shrink-0 transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-px flex-1 bg-border/50 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {activity.actor}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
