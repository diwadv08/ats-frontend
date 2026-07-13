/**
 * ─────────────────────────────────────────────────────────────
# RD ATS Admin — Dashboard Layout
 * Wraps all dashboard pages with the shell layout.
 * ─────────────────────────────────────────────────────────────
 */

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
