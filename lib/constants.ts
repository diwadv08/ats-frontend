/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Application Constants
 * ─────────────────────────────────────────────────────────────
 */

import { ApplicationStatus, ResumeStatus, JobStatus, EmploymentType } from "@/types";

export const APP_NAME = "RD ATS";
export const APP_VERSION = "1.0.0";
export const APP_TAGLINE = "Premium Applicant Tracking System";

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

export const JOB_STATUS_OPTIONS: { value: JobStatus; label: string; color: string }[] = [
  { value: "DRAFT", label: "Draft", color: "bg-slate-500" },
  { value: "OPEN", label: "Open", color: "bg-emerald-500" },
  { value: "PAUSED", label: "Paused", color: "bg-amber-500" },
  { value: "CLOSED", label: "Closed", color: "bg-rose-500" },
];

export const APPLICATION_STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-slate-500" },
  { value: "screening", label: "Screening", color: "bg-amber-500" },
  { value: "interview", label: "Interview", color: "bg-purple-500" },
  { value: "offer", label: "Offer", color: "bg-teal-500" },
  { value: "hired", label: "Hired", color: "bg-emerald-500" },
  { value: "rejected", label: "Rejected", color: "bg-rose-500" },
  { value: "withdrawn", label: "Withdrawn", color: "bg-orange-500" },
];

export const RESUME_STATUS_OPTIONS: { value: ResumeStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-amber-500" },
  { value: "reviewed", label: "Reviewed", color: "bg-purple-500" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-emerald-500" },
  { value: "rejected", label: "Rejected", color: "bg-rose-500" },
];

export const POSITION_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "QA Engineer",
  "Mobile Developer",
  "Security Engineer",
  "Technical Writer",
  "Scrum Master",
];

export const SKILL_OPTIONS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Next.js",
  "Tailwind CSS",
  "Figma",
  "Jest",
  "Cypress",
  "Go",
  "Rust",
  "Java",
  "Spring Boot",
];

export const SOURCE_OPTIONS = [
  "LinkedIn",
  "Indeed",
  "Company Website",
  "Referral",
  "Glassdoor",
  "AngelList",
  "Recruiter",
  "Job Fair",
  "Internal",
];

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_ITEMS_PER_PAGE = 10;

export const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Jobs", href: "/jobs", icon: "Briefcase" },
  { label: "Applicants", href: "/applicants", icon: "Users" },
  { label: "Interviews", href: "#", icon: "Calendar" },
  { label: "Offers", href: "#", icon: "FileText" },
  { label: "Team", href: "#", icon: "UserCog" },
  { label: "Reports", href: "#", icon: "BarChart3" },
  { label: "Settings", href: "#", icon: "Settings" },
];
