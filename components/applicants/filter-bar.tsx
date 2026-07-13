/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Filter Bar Component
 * Search, filters, and action buttons for the applicants page.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUS_OPTIONS, NOTICE_PERIOD_OPTIONS, POSITION_OPTIONS } from "@/lib/constants";
import { FilterParams, Applicant } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { ExportDialog } from "@/components/applicants/export-dialog";
import { parseApplicantsFile } from "@/lib/export-import";

interface FilterBarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onAddClick: () => void;
  exportableApplicants: Applicant[];
  onImport: (records: Partial<Applicant>[]) => number | Promise<number>;
}

export function FilterBar({
  filters,
  onFilterChange,
  onAddClick,
  exportableApplicants,
  onImport,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [exportOpen, setExportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch]);

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handlePositionChange = (value: string) => {
    onFilterChange({
      ...filters,
      position: value === "all" ? undefined : value,
      page: 1,
    });
  };
  const handleNoticePeriodChange = (value: string) => onFilterChange({ ...filters, noticePeriod: value === "all" ? undefined : value, page: 1 });

  const clearFilters = () => {
    setSearchValue("");
    onFilterChange({});
  };

  const hasActiveFilters =
    filters.search || filters.status || filters.position || filters.noticePeriod;

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const records = await parseApplicantsFile(file);
      if (records.length === 0) {
        toast.error("No valid rows found in that file");
        return;
      }
      const count = await onImport(records);
      toast.success(`Imported ${count} applicant${count === 1 ? "" : "s"}`);
    } catch (err) {
      toast.error("Could not read that file. Please upload a valid Excel/CSV file.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, position, or skills..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 h-11 bg-muted/30"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 h-5 w-5 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center">
                {[filters.search, filters.status, filters.position, filters.noticePeriod].filter(Boolean).length}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => importInputRef.current?.click()}
            isLoading={importing}
          >
            {!importing && <Upload className="h-4 w-4 mr-2" />}
            Import
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onAddClick} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Applicant
          </Button>
        </div>
      </div>

      {/* Expandable filters */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? "auto" : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="w-full sm:w-48">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Status
            </label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {APPLICATION_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-56">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Position
            </label>
            <Select
              value={filters.position || "all"}
              onValueChange={handlePositionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {POSITION_OPTIONS.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notice period</label>
            <Select value={filters.noticePeriod || "all"} onValueChange={handleNoticePeriodChange}>
              <SelectTrigger><SelectValue placeholder="All notice periods" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All notice periods</SelectItem>{NOTICE_PERIOD_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-medium">
              Search: "{filters.search}"
              <button onClick={() => { setSearchValue(""); onFilterChange({ ...filters, search: undefined }); }}>
                <X className="h-3 w-3 hover:text-emerald-500" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 px-3 py-1 text-xs font-medium">
              Status: {filters.status}
              <button onClick={() => onFilterChange({ ...filters, status: undefined })}>
                <X className="h-3 w-3 hover:text-purple-500" />
              </button>
            </span>
          )}
          {filters.position && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 text-xs font-medium">
              Position: {filters.position}
              <button onClick={() => onFilterChange({ ...filters, position: undefined })}>
                <X className="h-3 w-3 hover:text-amber-500" />
              </button>
            </span>
          )}
          {filters.noticePeriod && <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 px-3 py-1 text-xs font-medium">Notice: {filters.noticePeriod}<button onClick={() => onFilterChange({ ...filters, noticePeriod: undefined })}><X className="h-3 w-3 hover:text-sky-500" /></button></span>}
        </motion.div>
      )}

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        applicants={exportableApplicants}
      />
    </motion.div>
  );
}
