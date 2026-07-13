"use client";

import { useEffect, useState, useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import { KpiMetric, ChartDataPoint, ActivityItem } from "@/types";

interface DashboardSummary {
  totals: {
    totalJobs: number;
    openJobs: number;
    totalApplicants: number;
    hireRate: number;
  };
  kpis: KpiMetric[];
  hiringFunnel: ChartDataPoint[];
  positionDistribution: ChartDataPoint[];
  sourceBreakdown: ChartDataPoint[];
  applicationsOverTime: ChartDataPoint[];
  activity: ActivityItem[];
}

const EMPTY: DashboardSummary = {
  totals: { totalJobs: 0, openJobs: 0, totalApplicants: 0, hireRate: 0 },
  kpis: [],
  hiringFunnel: [],
  positionDistribution: [],
  sourceBreakdown: [],
  applicationsOverTime: [],
  activity: [],
};

/** Every value here is computed live from the Jobs/Applicants tables — no mock data. */
export function useDashboard() {
  const [data, setData] = useState<DashboardSummary>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardSummary>("/dashboard/summary");
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, refresh: load };
}
