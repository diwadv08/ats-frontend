/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Applicant Detail Component
 * Slide-over panel for viewing applicant details.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  MapPin,
  UserSquare2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SkillTag } from "@/components/shared/skill-tag";
import { Applicant } from "@/types";
import { formatDateTime, getInitials } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

interface ApplicantDetailProps {
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
  onEdit: (applicant: Applicant) => void;
}

export function ApplicantDetail({
  applicant,
  open,
  onClose,
  onEdit,
}: ApplicantDetailProps) {
  if (!applicant) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            style={{marginTop:'0'}}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-[var(--shadow-lg)] overflow-y-auto" 
            style={{marginTop:'0'}}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                      {getInitials(applicant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{applicant.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {applicant.position}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  status={applicant.applicationStatus}
                  type="application"
                />
                <StatusBadge
                  status={applicant.resumeStatus}
                  type="resume"
                />
              </div>

              {/* Contact info */}
              <div className="space-y-3 rounded-xl bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{applicant.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{applicant.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {applicant.experience} years experience
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Applied {formatDateTime(applicant.appliedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Source:{" "}
                    <span
                      className={
                        applicant.source === "Recruiter"
                          ? "font-medium text-primary"
                          : "font-medium"
                      }
                    >
                      {applicant.source}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <UserSquare2 className="h-4 w-4 text-muted-foreground" />
                  {applicant.resumeFileName ? (
                    <a href={`${API_BASE_URL}/applicants/${applicant.id}/resume`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                      View resume: <span className="font-medium">{applicant.resumeFileName}</span>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No resume uploaded
                    </span>
                  )}
                </div>
              </div>

              <div><h3 className="text-sm font-semibold mb-2">Availability & compensation</h3><div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/30 p-4 text-sm"><div><p className="text-xs text-muted-foreground">Notice period</p><p>{applicant.noticePeriod || "—"}</p></div><div><p className="text-xs text-muted-foreground">Current location</p><p>{applicant.currentLocation || "—"}</p></div><div><p className="text-xs text-muted-foreground">Preferred location</p><p>{applicant.preferredLocation || "—"}</p></div><div><p className="text-xs text-muted-foreground">Current / expected CTC</p><p>{applicant.currentCtc || "—"} / {applicant.expectedCtc || "—"}</p></div></div></div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {applicant.skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </div>

              {/* Notes */}
              {applicant.notes && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Notes</h3>
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {applicant.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onClose();
                    onEdit(applicant);
                  }}
                >
                  Edit Applicant
                </Button>
                <Button className="flex-1">Schedule Interview</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
