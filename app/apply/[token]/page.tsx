"use client";

import { use, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, Building2, CheckCircle2, ChevronLeft, ChevronRight, FileText, Loader2, Mail, MapPin, Phone, Sparkles, Upload, User } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { PublicJob } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/constants";
import { CTC_OPTIONS, NOTICE_PERIOD_OPTIONS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"), email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"), experience: z.coerce.number().min(0, "Experience cannot be negative"),
  skills: z.string().min(2, "Please add at least one skill"), source: z.string().min(2, "Please tell us where you found this role"),
  notes: z.string().optional(),
  noticePeriod: z.string().optional(), preferredLocation: z.string().optional(), currentLocation: z.string().optional(), currentCtc: z.string().optional(), expectedCtc: z.string().optional(),
});
type Values = z.infer<typeof schema>;
const steps = ["Contact", "Experience", "Resume"];

export default function ApplyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params); const [job, setJob] = useState<PublicJob | null>(null); const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false); const [submitted, setSubmitted] = useState(false); const [step, setStep] = useState(0);
  const [resume, setResume] = useState<File | null>(null); const [error, setError] = useState<string | null>(null); const fileRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, trigger, setValue, watch, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { experience: 0, source: "Careers Page" } });

  useEffect(() => { api.get<PublicJob>(`/jobs/public/${token}`).then(setJob).catch(() => setNotFound(true)).finally(() => setLoading(false)); }, [token]);
  const next = async () => { const fields = step === 0 ? ["name", "email", "phone"] as const : ["experience", "skills", "source"] as const; if (await trigger(fields)) setStep((value) => value + 1); };
  const submit = async (data: Values) => {
    if (!resume) { setError("Please attach your resume to continue."); return; }
    setError(null);
    try { await api.post(`/jobs/public/${token}/apply`, { ...data, skills: data.skills.split(",").map((skill) => skill.trim()).filter(Boolean), resumeFileName: resume.name, source: data.source }); setSubmitted(true); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to submit your application."); }
  };
  if (loading) return <div className="min-h-screen flex items-center justify-center p-6"><div className="w-full max-w-2xl space-y-4"><Skeleton className="h-36 w-full rounded-2xl" /><Skeleton className="h-96 w-full rounded-2xl" /></div></div>;
  if (notFound || !job) return <div className="min-h-screen flex items-center justify-center p-6 text-center"><div><Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-4" /><h1 className="text-xl font-semibold">This job posting isn't available</h1><p className="text-muted-foreground mt-2">The link may be invalid or this role has closed.</p></div></div>;
  if (submitted) return <div className="min-h-screen flex items-center justify-center p-6"><motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center space-y-4"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"><CheckCircle2 className="h-8 w-8 text-emerald-500" /></div><h1 className="text-2xl font-bold">Application submitted!</h1><p className="text-muted-foreground">Thanks for applying to <span className="font-medium">{job.title}</span>. We will be in touch if your profile is a match.</p></motion.div></div>;
  const employment = EMPLOYMENT_TYPE_OPTIONS.find((item) => item.value === job.employmentType)?.label || job.employmentType;
  return <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 px-4 py-8 sm:py-12"><div className="mx-auto max-w-3xl space-y-6">
    <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 sm:p-8"><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"><Sparkles className="h-3.5 w-3.5" /> Application for</p><h1 className="text-3xl font-bold tracking-tight">{job.title}</h1><div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {job.department || "General"}</span>{job.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>}<Badge variant="secondary">{employment}</Badge></div></motion.section>
    <section className="glass-card rounded-2xl p-6 sm:p-8"><div className="mb-8 flex items-center justify-between gap-2">{steps.map((label, index) => <div key={label} className="flex flex-1 items-center gap-2"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</div><span className={`hidden text-sm font-medium sm:inline ${index <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>{index < 2 && <div className={`h-px flex-1 ${index < step ? "bg-primary" : "bg-border"}`} />}</div>)}</div>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {step === 0 && <><h2 className="text-xl font-semibold">Your contact details</h2><div className="space-y-2"><label className="text-sm font-medium">Full name *</label><Input {...register("name")} icon={<User className="h-4 w-4" />} placeholder="Jane Doe" error={errors.name?.message} /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">Email *</label><Input {...register("email")} type="email" icon={<Mail className="h-4 w-4" />} placeholder="jane@example.com" error={errors.email?.message} /></div><div className="space-y-2"><label className="text-sm font-medium">Phone *</label><Input {...register("phone")} icon={<Phone className="h-4 w-4" />} placeholder="+1 555 000 0000" error={errors.phone?.message} /></div></div></>}
        {step === 1 && <><h2 className="text-xl font-semibold">Your experience</h2><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">Years of experience *</label><Input {...register("experience")} type="number" min={0} error={errors.experience?.message} /></div><div className="space-y-2"><label className="text-sm font-medium">Source *</label><Input {...register("source")} placeholder="LinkedIn, referral..." error={errors.source?.message} /></div></div><div className="space-y-2"><label className="text-sm font-medium">Skills *</label><Input {...register("skills")} placeholder="React, Node.js, SQL" error={errors.skills?.message} /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">Notice period</label><Select value={watch("noticePeriod") || "unspecified"} onValueChange={(v) => setValue("noticePeriod", v === "unspecified" ? "" : v)}><SelectTrigger><SelectValue placeholder="Select notice period" /></SelectTrigger><SelectContent><SelectItem value="unspecified">Not specified</SelectItem>{NOTICE_PERIOD_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><label className="text-sm font-medium">Current location</label><Input {...register("currentLocation")} placeholder="Your current city" /></div><div className="space-y-2"><label className="text-sm font-medium">Preferred location</label><Input {...register("preferredLocation")} placeholder="Preferred city or remote" /></div><div className="space-y-2"><label className="text-sm font-medium">Current CTC</label><Select value={watch("currentCtc") || "unspecified"} onValueChange={(v) => setValue("currentCtc", v === "unspecified" ? "" : v)}><SelectTrigger><SelectValue placeholder="Select current CTC" /></SelectTrigger><SelectContent><SelectItem value="unspecified">Not specified</SelectItem>{CTC_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><label className="text-sm font-medium">Expected CTC</label><Select value={watch("expectedCtc") || "unspecified"} onValueChange={(v) => setValue("expectedCtc", v === "unspecified" ? "" : v)}><SelectTrigger><SelectValue placeholder="Select expected CTC" /></SelectTrigger><SelectContent><SelectItem value="unspecified">Not specified</SelectItem>{CTC_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div></div><div className="space-y-2"><label className="text-sm font-medium">Notes</label><textarea {...register("notes")} rows={4} className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" placeholder="Portfolio, availability, or a short cover note..." /></div></>}
        {step === 2 && <><h2 className="text-xl font-semibold">Attach your resume</h2><p className="text-sm text-muted-foreground">Upload a PDF or Word document so the hiring team can review your application.</p><input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(event) => { setResume(event.target.files?.[0] || null); setError(null); }} /><button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center hover:bg-primary/10"><div className="rounded-full bg-primary/10 p-3 text-primary">{resume ? <FileText className="h-6 w-6" /> : <Upload className="h-6 w-6" />}</div><span className="font-medium">{resume ? resume.name : "Choose resume file"}</span><span className="text-xs text-muted-foreground">PDF, DOC, or DOCX</span></button></>}
        {error && <p className="text-sm text-rose-500">{error}</p>}<div className="flex justify-between gap-3 pt-3">{step > 0 ? <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)}><ChevronLeft className="h-4 w-4" /> Back</Button> : <span />}{step < 2 ? <Button type="button" onClick={next}>Continue <ChevronRight className="h-4 w-4" /></Button> : <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit application"}</Button>}</div>
      </form>
    </section>
  </div></main>;
}
