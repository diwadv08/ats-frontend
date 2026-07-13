"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Job, JobFormData, Paginated } from "@/types";

interface JobQuery {
  search?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: JobQuery;
  setQuery: (q: JobQuery | ((prev: JobQuery) => JobQuery)) => void;
  refresh: () => void;
  createJob: (data: JobFormData) => Promise<Job | null>;
  updateJob: (id: string, data: Partial<JobFormData>) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
}

function toPayload(data: Partial<JobFormData>) {
  const { skills, ...rest } = data;
  return {
    ...rest,
    skills:
      skills !== undefined
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
  };
}

/** Talks to the live NestJS `/jobs` API. Creating a job here is what generates
 * its unique, shareable public application URL. */
export function useJobs(initialQuery: JobQuery = {}): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<JobQuery>({ page: 1, limit: 12, ...initialQuery });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [reloadToken, setReloadToken] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Paginated<Job>>("/jobs", query);
      setJobs(res.data);
      setPagination((prev) => ({ ...prev, ...res.pagination }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [query, reloadToken]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  const createJob = useCallback(async (data: JobFormData): Promise<Job | null> => {
    try {
      const job = await api.post<Job>("/jobs", toPayload(data));
      refresh();
      return job;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create job");
      return null;
    }
  }, [refresh]);

  const updateJob = useCallback(async (id: string, data: Partial<JobFormData>) => {
    try {
      await api.patch(`/jobs/${id}`, toPayload(data));
      refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update job");
      return false;
    }
  }, [refresh]);

  const deleteJob = useCallback(async (id: string) => {
    try {
      await api.delete(`/jobs/${id}`);
      refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete job");
      return false;
    }
  }, [refresh]);

  return {
    jobs,
    loading,
    error,
    pagination,
    query,
    setQuery,
    refresh,
    createJob,
    updateJob,
    deleteJob,
  };
}
