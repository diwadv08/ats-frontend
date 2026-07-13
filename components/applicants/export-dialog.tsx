/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Export Applicants Dialog
 * Asks how many records to export (a from–to range, or the
 * entire record set) and in which format, then runs the export.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { runExport, type ExportFormat } from "@/lib/export-import";
import { Applicant } from "@/types";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  applicants: Applicant[];
}

export function ExportDialog({ open, onClose, applicants }: ExportDialogProps) {
  const [scope, setScope] = useState<"range" | "all">("all");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(Math.min(50, applicants.length || 1));
  const [format, setFormat] = useState<ExportFormat>("excel");
  const [exporting, setExporting] = useState(false);

  const total = applicants.length;

  const handleExport = async () => {
    setExporting(true);
    try {
      await runExport(applicants, {
        format,
        scope,
        from,
        to,
      });
      onClose();
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export applicants</DialogTitle>
          <DialogDescription>
            Choose how many records to export and in which format.{" "}
            {total} record{total === 1 ? "" : "s"} match your current filters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* How many */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How many records?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope("range")}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  scope === "range"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:bg-muted/50"
                )}
              >
                Custom range
              </button>
              <button
                type="button"
                onClick={() => setScope("all")}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  scope === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:bg-muted/50"
                )}
              >
                Entire records
              </button>
            </div>

            {scope === "range" && (
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    From
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={total || 1}
                    value={from}
                    onChange={(e) => setFrom(Number(e.target.value))}
                  />
                </div>
                <span className="mt-5 text-muted-foreground">–</span>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    To
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={total || 1}
                    value={to}
                    onChange={(e) => setTo(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("excel")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors",
                  format === "excel"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:bg-muted/50"
                )}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors",
                  format === "pdf"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:bg-muted/50"
                )}
              >
                <FileText className="h-4 w-4" />
                PDF
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} isLoading={exporting}>
              {!exporting && <Download className="h-4 w-4 mr-2" />}
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
