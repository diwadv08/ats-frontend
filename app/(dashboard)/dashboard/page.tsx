/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Dashboard Page
 * KPIs, charts, and activity feed rendered from the live API
 * (NestJS + PostgreSQL) — no mock/sample data.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Briefcase, Calendar, FileText, ArrowUpRight } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartFunnel } from "@/components/dashboard/chart-funnel";
import { ChartLine } from "@/components/dashboard/chart-line";
import { ChartDonut } from "@/components/dashboard/chart-donut";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useDashboard } from "@/hooks/use-dashboard";

const quickActions = [
  { label: "View Applicants", icon: Eye, href: "/applicants", color: "bg-primary/10 text-primary" },
  { label: "Post a Job", icon: Briefcase, href: "/jobs", color: "bg-secondary/10 text-secondary" },
  { label: "Open Jobs Board", icon: Calendar, href: "/jobs", color: "bg-primary/10 text-primary" },
  { label: "Export Applicants", icon: FileText, href: "/applicants", color: "bg-secondary/10 text-secondary" },
];

export default function DashboardPage() {
  const {
    kpis,
    hiringFunnel,
    applicationsOverTime,
    positionDistribution,
    sourceBreakdown,
    activity,
    totals,
    loading,
  } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {totals.totalJobs > 0
              ? `${totals.openJobs} open job${totals.openJobs === 1 ? "" : "s"} · ${totals.totalApplicants} applicant${totals.totalApplicants === 1 ? "" : "s"} so far.`
              : "Post your first job to start collecting applicants."}
          </p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 rounded-xl glass-card interactive-lift cursor-pointer group"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : totals.totalJobs === 0 && totals.totalApplicants === 0 ? (
        <EmptyState
          title="No data yet"
          description="Create your first job posting to generate a shareable application link and start seeing live metrics here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.label} {...kpi} index={i} />
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartFunnel data={hiringFunnel} />
        <ChartLine data={applicationsOverTime} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ChartDonut
            data={positionDistribution}
            title="Position Distribution"
            subtitle="Applicants by role"
          />
          <ChartDonut
            data={sourceBreakdown}
            title="Source Breakdown"
            subtitle="Where applicants come from"
          />
        </div>
        <ActivityFeed activities={activity} />
      </div>
    </div>
  );
}
