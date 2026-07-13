/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Core Type Definitions
 * Enterprise-grade TypeScript interfaces for the entire app.
 * ─────────────────────────────────────────────────────────────
 */

// ─── Applicant / CRUD Module ─────────────────────────────────

export type ApplicationStatus =
  | "new"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export type ResumeStatus = "pending" | "reviewed" | "shortlisted" | "rejected";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number; // years
  skills: string[];
  resumeStatus: ResumeStatus;
  applicationStatus: ApplicationStatus;
  appliedDate: string; // ISO date
  avatar?: string;
  notes?: string;
  /** Where the applicant came from — a job board/channel (e.g. LinkedIn) or "Recruiter" */
  source: string;
  /** File name of the uploaded resume, if any (client-side only in this demo) */
  resumeFileName?: string;
  /** Related Job record (every applicant is tied to a real job posting) */
  jobId?: string;
  job?: { id: string; title: string; slug: string };
}

export interface ApplicantFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string;
  resumeStatus: ResumeStatus;
  applicationStatus: ApplicationStatus;
  notes?: string;
  source: string;
  resumeFileName?: string;
}

// ─── Job / Dynamic Application Link Module ───────────────────

export type JobStatus = "DRAFT" | "OPEN" | "PAUSED" | "CLOSED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY";

export interface Job {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
  employmentType: EmploymentType;
  description: string;
  requirements?: string | null;
  skills: string[];
  minExperience?: number | null;
  maxExperience?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status: JobStatus;
  slug: string;
  applyToken: string;
  /** Fully-qualified, dynamically generated public application URL. */
  applyUrl: string;
  applicantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  department?: string;
  location?: string;
  employmentType: EmploymentType;
  description: string;
  requirements?: string;
  skills: string; // comma-separated in the form, split before sending
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
}

/** Public-facing subset of a Job, returned by the dynamic apply link. */
export interface PublicJob {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
  employmentType: EmploymentType;
  description: string;
  requirements?: string | null;
  skills: string[];
  minExperience?: number | null;
  maxExperience?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status: JobStatus;
}

export interface JobApplicationFormData {
  name: string;
  email: string;
  phone: string;
  experience?: number;
  skills?: string;
  notes?: string;
  resumeFileName?: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Dashboard / Analytics ───────────────────────────────────

export interface KpiMetric {
  label: string;
  value: number | string;
  change: number; // percentage
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondary?: number;
}

export interface ActivityItem {
  id: string;
  type: "applicant" | "interview" | "offer" | "rejection" | "hire" | "note" | "job";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  avatar?: string;
}

// ─── UI / Layout ─────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department: string;
}

export interface FilterParams {
  search?: string;
  status?: string;
  position?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ─── Form / Validation ────────────────────────────────────────

export interface FormFieldError {
  field: string;
  message: string;
}
