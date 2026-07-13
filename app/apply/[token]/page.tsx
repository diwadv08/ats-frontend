/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS — Public Job Application Page
 * This is the page a candidate lands on when they click a job's
 * dynamically generated URL: /apply/:token. No login required.
 * On submit, the data is sent straight to the backend and shows
 * up live in the admin's Applicants + Job detail views.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Briefcase,
  MapPin,
  Building2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Sparkles,
  Loader2,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { PublicJob } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/constants";

const applicationSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  experience: z.coerce.number().min(0).optional(),
  skills: z.string().optional(),
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({ resolver: zodResolver(applicationSchema) });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get<PublicJob>(`/jobs/public/${token}`);
        setJob(res);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setSubmitError(null);
    try {
      await api.post(`/jobs/public/${token}/apply`, {
        ...data,
        skills: data.skills
          ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        source: "Careers Page",
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-semibold">This job posting isn't available</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            The link may be invalid, or this position may no longer be accepting
            applications.
          </p>
        </div>
      </div>
    );
  }

  const employmentLabel =
    EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === job.employmentType)?.label ||
    job.employmentType;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center space-y-4"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold">Application submitted!</h1>
          <p className="text-muted-foreground">
            Thanks for applying to <span className="font-medium">{job.title}</span>.
            The hiring team will review your application and reach out if there's a
            match.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> You're applying for
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> {job.department || "General"}
            </span>
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {job.location}
              </span>
            )}
            <Badge variant="ghost">{employmentLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {job.description}
          </p>
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card rounded-xl p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold">Application Details</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name *</label>
            <Input
              {...register("name")}
              placeholder="Jane Doe"
              icon={<User className="h-4 w-4" />}
              error={errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone *</label>
              <Input
                {...register("phone")}
                placeholder="+1 555 000 0000"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Years of Experience</label>
              <Input {...register("experience")} type="number" min={0} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input {...register("skills")} placeholder="React, Node.js, SQL" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Anything else you'd like to share?</label>
            <textarea
              {...register("notes")}
              rows={4}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all resize-none"
              placeholder="Cover note, portfolio link, availability..."
            />
          </div>

          {submitError && <p className="text-sm text-rose-500">{submitError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
