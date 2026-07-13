/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Jobs Page
 * Create jobs and get a dynamically generated, shareable public
 * application link for each one.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Search, Briefcase } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { Job, JobFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { JobCard } from "@/components/jobs/job-card";
import { JobForm } from "@/components/jobs/job-form";
import { JobDeleteDialog } from "@/components/jobs/job-delete-dialog";
import { JOB_STATUS_OPTIONS } from "@/lib/constants";
import { useDebounce } from "@/hooks/use-debounce";

export default function JobsPage() {
  const { jobs, loading, query, setQuery, createJob, updateJob, deleteJob } = useJobs();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteJobData, setDeleteJobData] = useState<Job | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleAdd = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleDelete = (job: Job) => {
    setDeleteJobData(job);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: JobFormData) => {
    if (editingJob) {
      const success = await updateJob(editingJob.id, data);
      if (success) toast.success("Job updated successfully");
      return success;
    }
    const job = await createJob(data);
    if (job) toast.success("Job created — application link is ready to share");
    return job;
  };

  const handleConfirmDelete = async () => {
    if (!deleteJobData) return false;
    setIsDeleting(true);
    const success = await deleteJob(deleteJobData.id);
    setIsDeleting(false);
    if (success) {
      toast.success("Job deleted");
      setDeleteOpen(false);
      setDeleteJobData(null);
    }
    return success;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Post a job to instantly generate a shareable application link.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" /> Post Job
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search jobs by title, department, or location..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={query.status || "all"}
          onValueChange={(v) => setQuery({ ...query, status: v === "all" ? undefined : v, page: 1 })}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {JOB_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Post your first job to generate a dynamic application link you can share anywhere."
          action={{ label: "Post Job", onClick: handleAdd }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <JobForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleFormSubmit}
        job={editingJob}
      />

      <JobDeleteDialog
        job={deleteJobData}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
