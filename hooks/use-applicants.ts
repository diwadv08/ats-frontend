"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { normalizeApplicant, toApiEnum } from "@/lib/mappers";
import { Applicant, ApplicantFormData, FilterParams, Paginated } from "@/types";

interface UseApplicantsReturn {
  applicants: Applicant[];
  allApplicants: Applicant[];
  filteredApplicants: Applicant[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refresh: () => void;
  createApplicant: (data: ApplicantFormData) => Promise<boolean>;
  updateApplicant: (id: string, data: ApplicantFormData) => Promise<boolean>;
  deleteApplicant: (id: string) => Promise<boolean>;
  importApplicants: (records: Partial<Applicant>[]) => Promise<number>;
  getApplicant: (id: string) => Promise<Applicant | null>;
  stats: Record<string, number>;
}

/**
 * Talks to the live NestJS API (`/applicants`). Every applicant shown here
 * came either from an admin manually adding one, or from a candidate
 * submitting a job's dynamically generated public application form.
 */
export function useApplicants(initialFilters?: FilterParams): UseApplicantsReturn {
  const [items, setItems] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FilterParams>(initialFilters || {});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState<Record<string, number>>({});
  const [reloadToken, setReloadToken] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: Record<string, unknown> = {
        search: filters.search,
        status: filters.status ? toApiEnum(filters.status) : undefined,
        position: filters.position,
        noticePeriod: filters.noticePeriod,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: pagination.page,
        limit: pagination.limit,
      };
      const res = await api.get<Paginated<any>>("/applicants", query);
      setItems(res.data.map(normalizeApplicant));
      setPagination((prev) => ({ ...prev, ...res.pagination }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, reloadToken]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.limit, reloadToken]);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get<Record<string, number>>("/applicants/stats/summary");
      setStats(res);
    } catch {
      /* stats are non-critical */
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, reloadToken]);

  const setFilters = useCallback((nextFilters: FilterParams) => {
    setFiltersState(nextFilters);
    setPagination((prev) => ({ ...prev, page: nextFilters.page || 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  const toPayload = (data: ApplicantFormData) => ({
    name: data.name,
    email: data.email,
    phone: data.phone,
    position: data.position,
    experience: Number(data.experience) || 0,
    skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
    resumeStatus: toApiEnum(data.resumeStatus),
    applicationStatus: toApiEnum(data.applicationStatus),
    source: data.source,
    notes: data.notes,
    resumeFileName: data.resumeFileName,
    noticePeriod: data.noticePeriod,
    preferredLocation: data.preferredLocation,
    currentLocation: data.currentLocation,
    currentCtc: data.currentCtc,
    expectedCtc: data.expectedCtc,
  });

  const createApplicant = useCallback(async (data: ApplicantFormData) => {
    try {
      await api.post("/applicants", toPayload(data));
      refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create applicant");
      return false;
    }
  }, [refresh]);

  const updateApplicant = useCallback(async (id: string, data: ApplicantFormData) => {
    try {
      await api.patch(`/applicants/${id}`, toPayload(data));
      refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update applicant");
      return false;
    }
  }, [refresh]);

  const deleteApplicant = useCallback(async (id: string) => {
    try {
      await api.delete(`/applicants/${id}`);
      refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete applicant");
      return false;
    }
  }, [refresh]);

  const importApplicants = useCallback(async (records: Partial<Applicant>[]) => {
    let imported = 0;
    for (const record of records) {
      try {
        await api.post("/applicants", {
          name: record.name || "Unnamed Applicant",
          email: record.email || "",
          phone: record.phone || "",
          position: record.position || "Unspecified",
          experience: Number(record.experience) || 0,
          skills: Array.isArray(record.skills)
            ? record.skills
            : String(record.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
          resumeStatus: toApiEnum(record.resumeStatus || "pending"),
          applicationStatus: toApiEnum(record.applicationStatus || "new"),
          source: record.source || "Imported",
          notes: record.notes,
        });
        imported += 1;
      } catch {
        /* skip invalid rows */
      }
    }
    if (imported) refresh();
    return imported;
  }, [refresh]);

  const getApplicant = useCallback(async (id: string) => {
    try {
      const res = await api.get<any>(`/applicants/${id}`);
      return normalizeApplicant(res);
    } catch {
      return null;
    }
  }, []);

  const filteredApplicants = items;
  const applicants = items;
  const allApplicants = items;

  return {
    applicants,
    allApplicants,
    filteredApplicants,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    setLimit,
    refresh,
    createApplicant,
    updateApplicant,
    deleteApplicant,
    importApplicants,
    getApplicant,
    stats,
  };
}
