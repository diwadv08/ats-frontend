/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Applicant Table Component
 * TanStack Table with sorting, pagination, and actions.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserSquare2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkeletonTable } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { SkillTag } from "@/components/shared/skill-tag";
import { EmptyState } from "@/components/shared/empty-state";
import { Applicant } from "@/types";
import { formatDate, getInitials, cn } from "@/lib/utils";
import { ITEMS_PER_PAGE_OPTIONS } from "@/lib/constants";

interface ApplicantTableProps {
  applicants: Applicant[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (applicant: Applicant) => void;
  onEdit: (applicant: Applicant) => void;
  onDelete: (applicant: Applicant) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export function ApplicantTable({
  applicants,
  loading,
  pagination,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: ApplicantTableProps) {

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field)
      return (
        <ChevronUp className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-50" />
      );
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3 w-3 text-emerald-500" />
    ) : (
      <ChevronDown className="h-3 w-3 text-emerald-500" />
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => onSort?.(field)}
      className="flex items-center gap-1 group font-semibold"
    >
      {children}
      <SortIcon field={field} />
    </button>
  );

  if (loading) return <SkeletonTable rows={5} cols={9} />;
  if (applicants.length === 0) {
    return (
      <EmptyState
        title="No applicants found"
        description="Try adjusting your filters or add a new applicant."
        action={{ label: "Add Applicant", onClick: () => {} }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>
                <SortableHeader field="name">Applicant</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="position">Position</SortableHeader>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortableHeader field="experience">Exp.</SortableHeader>
              </TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>
                <SortableHeader field="appliedDate">Applied</SortableHeader>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant, i) => (
              <motion.tr
                key={applicant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                      <AvatarFallback className="bg-primary font-semibold">
                        {getInitials(applicant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {applicant.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{applicant.position}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={applicant.applicationStatus}
                    type="application"
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm">{applicant.experience} yrs</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {applicant.skills.slice(0, 3).map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                    {applicant.skills.length > 3 && (
                      <Badge variant="ghost" className="text-xs">
                        +{applicant.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1",
                      applicant.source === "Recruiter"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/60 text-muted-foreground"
                    )}
                  >
                    <UserSquare2 className="h-3 w-3" />
                    {applicant.source}
                  </span>
                </TableCell>
                <TableCell>
                  {applicant.resumeFileName ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="max-w-[120px] truncate">
                        {applicant.resumeFileName}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(applicant.appliedDate)}
                  </span>
                </TableCell>
                <TableCell><div className="flex items-center gap-1"><button title="View" onClick={() => onView(applicant)} className="rounded-lg p-2 hover:bg-muted"><Eye className="h-4 w-4" /></button><button title="Edit" onClick={() => onEdit(applicant)} className="rounded-lg p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button><button title="Delete" onClick={() => onDelete(applicant)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div></TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </span>
          <select
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-border/50 bg-background px-2 text-xs"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => onPageChange(pageNum)}
                  className="h-8 w-8 text-xs"
                >
                  {pageNum}
                </Button>
              );
            }
          )}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
