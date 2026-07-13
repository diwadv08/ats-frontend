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
import { Job } from "@/types";

interface JobDeleteDialogProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  isDeleting: boolean;
}

export function JobDeleteDialog({ job, open, onClose, onConfirm, isDeleting }: JobDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <DialogTitle>Delete Job</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{job?.title}</span>? Its
            public application link will stop working and all linked applicants will
            also be removed.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} isLoading={isDeleting}>
            Delete Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
