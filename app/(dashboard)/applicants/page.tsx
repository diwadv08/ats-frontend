/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Applicants Page
 * Full CRUD module with table, filters, forms, and detail view.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { useApplicants } from "@/hooks/use-applicants";
import { Applicant, ApplicantFormData } from "@/types";
import { FilterBar } from "@/components/applicants/filter-bar";
import { ApplicantTable } from "@/components/applicants/applicant-table";
import { ApplicantForm } from "@/components/applicants/applicant-form";
import { ApplicantDetail } from "@/components/applicants/applicant-detail";
import { DeleteDialog } from "@/components/applicants/delete-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicantsPage() {
  const {
    applicants,
    filteredApplicants,
    loading,
    pagination,
    filters,
    setFilters,
    setPage,
    setLimit,
    createApplicant,
    updateApplicant,
    deleteApplicant,
    importApplicants,
    stats,
  } = useApplicants();

  const [formOpen, setFormOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(
    null
  );
  const [detailApplicant, setDetailApplicant] = useState<Applicant | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteApplicantData, setDeleteApplicantData] =
    useState<Applicant | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = () => {
    setEditingApplicant(null);
    setFormOpen(true);
  };

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setFormOpen(true);
  };

  const handleView = (applicant: Applicant) => {
    setDetailApplicant(applicant);
    setDetailOpen(true);
  };

  const handleDelete = (applicant: Applicant) => {
    setDeleteApplicantData(applicant);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (
    data: ApplicantFormData
  ): Promise<boolean> => {
    if (editingApplicant) {
      const success = await updateApplicant(editingApplicant.id, data);
      if (success) {
        toast.success("Applicant updated successfully");
      }
      return success;
    } else {
      const success = await createApplicant(data);
      if (success) {
        toast.success("Applicant created successfully");
      }
      return success;
    }
  };

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!deleteApplicantData) return false;
    setIsDeleting(true);
    const success = await deleteApplicant(deleteApplicantData.id);
    setIsDeleting(false);
    if (success) {
      toast.success("Applicant deleted successfully");
      setDeleteOpen(false);
      setDeleteApplicantData(null);
    }
    return success;
  };

  const handleSort = (field: string) => {
    const newOrder =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters({ ...filters, sortBy: field, sortOrder: newOrder });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
            <p className="text-muted-foreground">
              Manage and track all job applicants
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: pagination.total,
            color: "bg-slate-500/10 text-slate-600",
          },
          {
            label: "New",
            value: stats.new ?? 0,
            color: "bg-emerald-500/10 text-emerald-600",
          },
          {
            label: "Interview",
            value: stats.interview ?? 0,
            color: "bg-purple-500/10 text-purple-600",
          },
          {
            label: "Hired",
            value: stats.hired ?? 0,
            color: "bg-amber-500/10 text-amber-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <div className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>
              {loading ? <Skeleton className="h-8 w-12" /> : stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onAddClick={handleAdd}
        exportableApplicants={filteredApplicants}
        onImport={importApplicants}
      />

      {/* Table */}
      <ApplicantTable
        applicants={applicants}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={handleSort}
      />

      {/* Form Modal */}
      <ApplicantForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingApplicant(null);
        }}
        onSubmit={handleFormSubmit}
        applicant={editingApplicant}
      />

      {/* Detail Panel */}
      <ApplicantDetail
        applicant={detailApplicant}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailApplicant(null);
        }}
        onEdit={handleEdit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        applicant={deleteApplicantData}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteApplicantData(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
