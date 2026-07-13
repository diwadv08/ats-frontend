/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Applicant Form Component
 * Add/Edit form with React Hook Form + Zod validation.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Briefcase, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Applicant, ApplicantFormData } from "@/types";
import {
  APPLICATION_STATUS_OPTIONS,
  RESUME_STATUS_OPTIONS,
  POSITION_OPTIONS,
  SOURCE_OPTIONS,
} from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  position: z.string().min(1, "Position is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience must be 0 or more")
    .max(50, "Experience must be 50 or less"),
  skills: z.string().min(2, "Skills are required"),
  resumeStatus: z.enum(["pending", "reviewed", "shortlisted", "rejected"]),
  applicationStatus: z.enum([
    "new",
    "screening",
    "interview",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
  ]),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional(),
});

interface ApplicantFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicantFormData) => Promise<boolean>;
  applicant?: Applicant | null;
}

export function ApplicantForm({
  open,
  onClose,
  onSubmit,
  applicant,
}: ApplicantFormProps) {
  const isEditing = !!applicant;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFileName, setResumeFileName] = useState<string | undefined>(
    undefined
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: 0,
      skills: "",
      resumeStatus: "pending",
      applicationStatus: "new",
      source: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (applicant) {
      reset({
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        position: applicant.position,
        experience: applicant.experience,
        skills: applicant.skills.join(", "),
        resumeStatus: applicant.resumeStatus,
        applicationStatus: applicant.applicationStatus,
        source: applicant.source,
        notes: applicant.notes || "",
      });
      setResumeFileName(applicant.resumeFileName);
    } else {
      reset();
      setResumeFileName(undefined);
    }
  }, [applicant, reset]);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    const success = await onSubmit({
      ...data,
      resumeFileName,
    } as ApplicantFormData);
    if (success) {
      onClose();
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFileName(file.name);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Applicant" : "Add New Applicant"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the applicant's information below."
              : "Fill in the details to add a new applicant."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 mt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                {...register("name")}
                placeholder="John Doe"
                icon={<User className="h-4 w-4" />}
                error={errors.name?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="john@email.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone *</label>
              <Input
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position *</label>
              <Select
                value={watch("position")}
                onValueChange={(v) => setValue("position", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_OPTIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-xs text-rose-500">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Experience (years) *
              </label>
              <Input
                {...register("experience")}
                type="number"
                min={0}
                max={50}
                error={errors.experience?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Source / Recruiter *
              </label>
              <Select
                value={watch("source")}
                onValueChange={(v) => setValue("source", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((src) => (
                    <SelectItem key={src} value={src}>
                      {src}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-xs text-rose-500">
                  {errors.source.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Where the applicant came from — a job board, a referral, or
                "Recruiter" if sourced by a recruiter.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Skills * (comma-separated)
            </label>
            <Input
              {...register("skills")}
              placeholder="React, TypeScript, Node.js"
              icon={<Briefcase className="h-4 w-4" />}
              error={errors.skills?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume Status</label>
              <Select
                value={watch("resumeStatus")}
                onValueChange={(v: any) => setValue("resumeStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESUME_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Application Status</label>
              <Select
                value={watch("applicationStatus")}
                onValueChange={(v: any) => setValue("applicationStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resume</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeChange}
            />
            {resumeFileName ? (
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm truncate">{resumeFileName}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeFileName(undefined)}
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background/50 px-4 py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload resume (PDF or Word)
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all resize-none"
              placeholder="Additional notes about the applicant..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Update Applicant" : "Add Applicant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
