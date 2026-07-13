/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — StatusBadge Component
 * Dynamic status badge for application and resume statuses.
 * ─────────────────────────────────────────────────────────────
 */

import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, ResumeStatus } from "@/types";
import { APPLICATION_STATUS_OPTIONS, RESUME_STATUS_OPTIONS } from "@/lib/constants";

interface StatusBadgeProps {
  status: ApplicationStatus | ResumeStatus;
  type?: "application" | "resume";
  className?: string;
}

const applicationStatusMap: Record<ApplicationStatus, string> = {
  new: "slate",
  screening: "amber",
  interview: "purple",
  offer: "teal",
  hired: "emerald",
  rejected: "rose",
  withdrawn: "orange",
};

const resumeStatusMap: Record<ResumeStatus, string> = {
  pending: "amber",
  reviewed: "purple",
  shortlisted: "emerald",
  rejected: "rose",
};

export function StatusBadge({ status, type = "application", className }: StatusBadgeProps) {
  const label =
    type === "application"
      ? APPLICATION_STATUS_OPTIONS.find((o) => o.value === status)?.label
      : RESUME_STATUS_OPTIONS.find((o) => o.value === status)?.label;

  const variant =
    type === "application"
      ? (applicationStatusMap[status as ApplicationStatus] as any)
      : (resumeStatusMap[status as ResumeStatus] as any);

  return (
    <Badge variant={variant} className={className}>
      {label || status}
    </Badge>
  );
}
