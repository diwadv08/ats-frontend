import { Applicant } from "@/types";

/** Backend enums are UPPER_SNAKE_CASE (Prisma convention); the existing UI
 * (badges, filters, constants) was built around lowercase values, so we
 * normalize at the API boundary instead of touching every component. */
export function toApiEnum(value: string): string {
  return value.toUpperCase();
}

export function fromApiEnum(value: string): string {
  return value.toLowerCase();
}

export function normalizeApplicant(raw: any): Applicant {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    position: raw.position,
    experience: raw.experience,
    skills: raw.skills || [],
    resumeStatus: fromApiEnum(raw.resumeStatus) as Applicant["resumeStatus"],
    applicationStatus: fromApiEnum(raw.applicationStatus) as Applicant["applicationStatus"],
    appliedDate: raw.appliedDate,
    notes: raw.notes || undefined,
    source: raw.source,
    resumeFileName: raw.resumeFileName || undefined,
    jobId: raw.jobId,
    job: raw.job,
  };
}
