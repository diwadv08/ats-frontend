"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, MapPin, Building2, DollarSign } from "lucide-react";
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
import { Job, JobFormData } from "@/types";
import { EMPLOYMENT_TYPE_OPTIONS, JOB_STATUS_OPTIONS } from "@/lib/constants";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
  skills: z.string().optional(),
  minExperience: z.coerce.number().min(0).optional(),
  maxExperience: z.coerce.number().min(0).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  status: z.enum(["DRAFT", "OPEN", "PAUSED", "CLOSED"]),
});

type FormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => Promise<boolean | Job | null>;
  job?: Job | null;
}

export function JobForm({ open, onClose, onSubmit, job }: JobFormProps) {
  const isEditing = !!job;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "FULL_TIME",
      description: "",
      requirements: "",
      skills: "",
      status: "OPEN",
    },
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        department: job.department || "",
        location: job.location || "",
        employmentType: job.employmentType,
        description: job.description,
        requirements: job.requirements || "",
        skills: job.skills.join(", "),
        minExperience: job.minExperience ?? undefined,
        maxExperience: job.maxExperience ?? undefined,
        salaryMin: job.salaryMin ?? undefined,
        salaryMax: job.salaryMax ?? undefined,
        status: job.status,
      });
    } else {
      reset({
        title: "",
        department: "",
        location: "",
        employmentType: "FULL_TIME",
        description: "",
        requirements: "",
        skills: "",
        status: "OPEN",
      });
    }
  }, [job, reset]);

  const handleFormSubmit = async (data: FormValues) => {
    const result = await onSubmit(data as JobFormData);
    if (result) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Job" : "Post a New Job"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this job posting. The shareable application link stays the same."
              : "Creating a job generates a unique, shareable application link automatically."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Job Title *</label>
              <Input
                {...register("title")}
                placeholder="Senior Backend Engineer"
                icon={<Briefcase className="h-4 w-4" />}
                error={errors.title?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                {...register("department")}
                placeholder="Engineering"
                icon={<Building2 className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                {...register("location")}
                placeholder="Remote / Bengaluru"
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employment Type</label>
              <Select
                value={watch("employmentType")}
                onValueChange={(v: any) => setValue("employmentType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={watch("status")} onValueChange={(v: any) => setValue("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only "Open" jobs accept applications through the public link.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all resize-none"
              placeholder="Describe the role, responsibilities, and what a great day looks like..."
            />
            {errors.description && (
              <p className="text-xs text-rose-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements</label>
            <textarea
              {...register("requirements")}
              rows={3}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all resize-none"
              placeholder="Must-have skills, years of experience, qualifications..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Skills (comma-separated)</label>
            <Input
              {...register("skills")}
              placeholder="React, TypeScript, Node.js"
              icon={<Briefcase className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Exp (yrs)</label>
              <Input {...register("minExperience")} type="number" min={0} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Exp (yrs)</label>
              <Input {...register("maxExperience")} type="number" min={0} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Min</label>
              <Input
                {...register("salaryMin")}
                type="number"
                min={0}
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Max</label>
              <Input
                {...register("salaryMax")}
                type="number"
                min={0}
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Update Job" : "Create Job & Get Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
