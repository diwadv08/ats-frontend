/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Applicant Export / Import Utilities
 * Exports applicant records to Excel (.xlsx) or PDF, and parses
 * an uploaded Excel/CSV file back into applicant records.
 * ─────────────────────────────────────────────────────────────
 */

import * as XLSX from "xlsx";
import { Applicant } from "@/types";
import { formatDate } from "@/lib/utils";

export type ExportFormat = "excel" | "pdf";

const EXPORT_COLUMNS: { key: keyof Applicant; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "position", label: "Position" },
  { key: "experience", label: "Experience (yrs)" },
  { key: "skills", label: "Skills" },
  { key: "resumeStatus", label: "Resume Status" },
  { key: "applicationStatus", label: "Application Status" },
  { key: "appliedDate", label: "Applied Date" },
  { key: "source", label: "Source" },
  { key: "resumeFileName", label: "Resume File" },
  { key: "notes", label: "Notes" },
];

function toRow(applicant: Applicant): Record<string, string | number> {
  const row: Record<string, string | number> = {};
  for (const col of EXPORT_COLUMNS) {
    const value = applicant[col.key];
    if (col.key === "skills") {
      row[col.label] = Array.isArray(value) ? value.join(", ") : "";
    } else if (col.key === "appliedDate") {
      row[col.label] = value ? formatDate(value as string) : "";
    } else {
      row[col.label] = (value as string | number) ?? "";
    }
  }
  return row;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Export a set of applicants as an .xlsx workbook. */
export function exportApplicantsToExcel(
  applicants: Applicant[],
  filename = "applicants-export.xlsx"
) {
  const rows = applicants.map(toRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = EXPORT_COLUMNS.map((c) => ({
    wch: Math.max(12, c.label.length + 2),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
  XLSX.writeFile(workbook, filename);
}

/** Export a set of applicants as a PDF table. */
export async function exportApplicantsToPDF(
  applicants: Applicant[],
  filename = "applicants-export.pdf"
) {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape" });
  const columns = EXPORT_COLUMNS.filter(
    (c) => c.key !== "notes" && c.key !== "resumeFileName"
  );

  doc.setFontSize(14);
  doc.text("Applicants Export", 14, 14);
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString()} — ${applicants.length} record(s)`, 14, 20);

  autoTable(doc, {
    startY: 26,
    head: [columns.map((c) => c.label)],
    body: applicants.map((a) =>
      columns.map((c) => {
        const value = a[c.key];
        if (c.key === "skills") return Array.isArray(value) ? value.join(", ") : "";
        if (c.key === "appliedDate") return value ? formatDate(value as string) : "";
        return String(value ?? "");
      })
    ),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [99, 60, 220] },
    alternateRowStyles: { fillColor: [245, 245, 250] },
  });

  doc.save(filename);
}

export interface ExportOptions {
  format: ExportFormat;
  scope: "range" | "all";
  from?: number;
  to?: number;
}

/** Slice applicants according to export options (1-indexed inclusive range, or all). */
export function selectApplicantsForExport(
  applicants: Applicant[],
  options: ExportOptions
): Applicant[] {
  if (options.scope === "all") return applicants;
  const from = Math.max(1, options.from ?? 1);
  const to = Math.min(applicants.length, options.to ?? applicants.length);
  if (to < from) return [];
  return applicants.slice(from - 1, to);
}

export async function runExport(
  applicants: Applicant[],
  options: ExportOptions
) {
  const selected = selectApplicantsForExport(applicants, options);
  const stamp = new Date().toISOString().slice(0, 10);
  if (options.format === "excel") {
    exportApplicantsToExcel(selected, `applicants-${stamp}.xlsx`);
  } else {
    await exportApplicantsToPDF(selected, `applicants-${stamp}.pdf`);
  }
  return selected.length;
}

/** Parse an uploaded Excel/CSV file into partial applicant records. */
export function parseApplicantsFile(file: File): Promise<Partial<Applicant>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: "",
        });

        const records: Partial<Applicant>[] = rows.map((row) => {
          const get = (...keys: string[]) => {
            for (const key of keys) {
              const found = Object.keys(row).find(
                (k) => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (found && row[found] !== "") return row[found];
            }
            return undefined;
          };

          return {
            name: String(get("Name", "Full Name") ?? ""),
            email: String(get("Email") ?? ""),
            phone: String(get("Phone") ?? ""),
            position: String(get("Position") ?? ""),
            experience: Number(get("Experience (yrs)", "Experience") ?? 0),
            skills: String(get("Skills") ?? ""),
            resumeStatus: String(
              get("Resume Status") ?? "pending"
            ).toLowerCase() as Applicant["resumeStatus"],
            applicationStatus: String(
              get("Application Status") ?? "new"
            ).toLowerCase() as Applicant["applicationStatus"],
            appliedDate: String(get("Applied Date") ?? ""),
            source: String(get("Source") ?? "Imported"),
            resumeFileName: get("Resume File")
              ? String(get("Resume File"))
              : undefined,
            notes: get("Notes") ? String(get("Notes")) : undefined,
          } as unknown as Partial<Applicant>;
        });

        resolve(records.filter((r) => r.name));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}
