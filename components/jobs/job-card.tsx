"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types";
import { EMPLOYMENT_TYPE_OPTIONS, JOB_STATUS_OPTIONS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { CopyLinkButton } from "./copy-link-button";

const statusVariant: Record<string, any> = {
  DRAFT: "slate",
  OPEN: "default",
  PAUSED: "amber",
  CLOSED: "destructive",
};

interface JobCardProps {
  job: Job;
  index?: number;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

export function JobCard({ job, index = 0, onEdit, onDelete }: JobCardProps) {
  const employmentLabel =
    EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === job.employmentType)?.label ||
    job.employmentType;
  const statusLabel = JOB_STATUS_OPTIONS.find((o) => o.value === job.status)?.label || job.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-card rounded-xl p-5 flex flex-col gap-4 interactive-lift"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/jobs/${job.id}`} className="hover:underline">
            <h3 className="font-semibold text-base truncate">{job.title}</h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.department || "General"} {job.location ? `· ${job.location}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-1"><Link title="View" href={`/jobs/${job.id}`} className="rounded-lg p-2 hover:bg-muted"><Eye className="h-4 w-4" /></Link><button title="Edit" onClick={() => onEdit(job)} className="rounded-lg p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button><button title="Delete" onClick={() => onDelete(job)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant[job.status] || "default"}>{statusLabel}</Badge>
        <Badge variant="ghost">{employmentLabel}</Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {job.applicantCount ?? 0} applicant
          {(job.applicantCount ?? 0) === 1 ? "" : "s"}
        </span>
        <span>Posted by {job.createdByUser?.name || "Unknown"} · {formatDate(job.createdAt)}</span>
      </div>

      <div className="border-t border-border/50 pt-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
          Shareable application link
        </p>
        <CopyLinkButton url={job.applyUrl} />
      </div>
    </motion.div>
  );
}
