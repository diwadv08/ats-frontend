/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Job Detail Page
 * Shows the job's dynamically generated public application link
 * and the live list of applicants who applied through it.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Pencil,
  Trash2,
  Briefcase,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Job, Applicant, Paginated } from "@/types";
import { normalizeApplicant } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CopyLinkButton } from "@/components/jobs/copy-link-button";
import { JobForm } from "@/components/jobs/job-form";
import { JobDeleteDialog } from "@/components/jobs/job-delete-dialog";
import { useJobs } from "@/hooks/use-jobs";
import { EMPLOYMENT_TYPE_OPTIONS, JOB_STATUS_OPTIONS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const statusVariant: Record<string, any> = {
  DRAFT: "slate",
  OPEN: "default",
  PAUSED: "amber",
  CLOSED: "destructive",
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { updateJob, deleteJob } = useJobs();

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadJob = async () => {
    setLoading(true);
    try {
      const res = await api.get<Job>(`/jobs/${id}`);
      setJob(res);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async () => {
    setLoadingApplicants(true);
    try {
      const res = await api.get<Paginated<any>>("/applicants", { jobId: id, limit: 50 });
      setApplicants(res.data.map(normalizeApplicant));
    } catch {
      /* non-critical */
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    loadJob();
    loadApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (data: any) => {
    const success = await updateJob(id, data);
    if (success) {
      toast.success("Job updated");
      loadJob();
    }
    return success;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteJob(id);
    setIsDeleting(false);
    if (success) {
      toast.success("Job deleted");
      router.push("/jobs");
    }
    return success;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Job not found"
        description="This job may have been deleted."
        action={{ label: "Back to Jobs", onClick: () => router.push("/jobs") }}
      />
    );
  }

  const employmentLabel =
    EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === job.employmentType)?.label ||
    job.employmentType;
  const statusLabel = JOB_STATUS_OPTIONS.find((o) => o.value === job.status)?.label || job.status;

  return (
    <div className="space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={statusVariant[job.status] || "default"}>{statusLabel}</Badge>
              <Badge variant="ghost">{employmentLabel}</Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {job.department || "General"}
              </span>
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {applicants.length} applicant
                {applicants.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Dynamic application link — share this with candidates
          </p>
          <CopyLinkButton url={job.applyUrl} />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-1.5">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.requirements && (
          <div>
            <h2 className="text-sm font-semibold mb-1.5">Requirements</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {job.requirements}
            </p>
          </div>
        )}

        {job.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-1.5">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="ghost">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Applicants for this job</h2>
        {loadingApplicants ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <EmptyState
            variant="inbox"
            title="No applicants yet"
            description="Share the application link above — new applicants will show up here instantly."
          />
        ) : (
          <div className="glass-card rounded-xl divide-y divide-border/50">
            {applicants.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.email} · Applied {formatDate(a.appliedDate)}
                  </p>
                </div>
                <StatusBadge status={a.applicationStatus} type="application" />
              </div>
            ))}
          </div>
        )}
      </div>

      <JobForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleUpdate} job={job} />
      <JobDeleteDialog
        job={job}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
