"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
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
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-border/50 bg-popover shadow-[var(--shadow-md)] py-1"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(job);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(job);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-muted"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
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
        <span>Posted {formatDate(job.createdAt)}</span>
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
