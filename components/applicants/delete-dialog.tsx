/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Delete Confirmation Dialog
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Applicant } from "@/types";

interface DeleteDialogProps {
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  isDeleting: boolean;
}

export function DeleteDialog({
  applicant,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <DialogTitle>Delete Applicant</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {applicant?.name}
            </span>
            ? All associated data will be permanently removed.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Delete Applicant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
