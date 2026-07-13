/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — SkillTag Component
 * Compact skill chip with color coding.
 * ─────────────────────────────────────────────────────────────
 */

import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: string;
  className?: string;
}

const skillColors: Record<string, string> = {
  React: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  TypeScript: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  "Node.js": "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  Python: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300",
  AWS: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  Docker: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300",
  Kubernetes: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300",
  GraphQL: "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300",
  PostgreSQL: "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300",
  MongoDB: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  Redis: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  "Next.js": "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300",
  "Tailwind CSS": "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  Figma: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
  Jest: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
  Cypress: "bg-lime-100 text-lime-800 dark:bg-lime-500/20 dark:text-lime-300",
  Go: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300",
  Rust: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  Java: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  "Spring Boot": "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
};

export function SkillTag({ skill, className }: SkillTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        skillColors[skill] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {skill}
    </span>
  );
}
