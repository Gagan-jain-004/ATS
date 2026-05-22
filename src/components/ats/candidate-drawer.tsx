"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Mail, Phone, BadgeInfo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type CandidateSummary, type CandidateStatus } from "@/lib/types";

export function CandidateDrawer({
  candidate,
  jobId,
  open,
  onOpenChange
}: {
  candidate: CandidateSummary | null;
  jobId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(candidate?.status ?? "UNREAD");
  const [note, setNote] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    setStatus(candidate?.status ?? "UNREAD");
    setNote("");
  }, [candidate]);

  async function saveStatus() {
    if (!candidate) return;

    setIsSavingStatus(true);
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status })
      });

      if (response.ok) {
        router.refresh();
      }
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function saveNote() {
    if (!candidate || !note.trim()) return;

    setIsSavingNote(true);
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, notes: note.trim() })
      });

      if (response.ok) {
        setNote("");
        router.refresh();
      }
    } finally {
      setIsSavingNote(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 sm:max-h-[90vh] sm:overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="mb-4">
            <Badge variant="secondary" className="w-fit">Candidate Profile</Badge>
            <DialogTitle>{candidate?.fullName ?? "Candidate"}</DialogTitle>
            <DialogDescription>Review the candidate, update the status, add notes, and download the resume.</DialogDescription>
          </DialogHeader>

        {candidate ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Match score</p>
                    <p className="text-4xl font-extrabold text-slate-950">{candidate.matchPercentage}%</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">{candidate.status}</Badge>
                    <p className="mt-2 text-sm text-slate-500">Uploaded {candidate.uploadDate}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Role</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{candidate.role}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Experience</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{candidate.experienceYears} years</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-white p-5">
                <h4 className="font-semibold text-slate-950">Matching Skills</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {candidate.matchedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <h4 className="mt-5 font-semibold text-slate-950">Missing Skills</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {candidate.missingSkills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-white p-5">
                <h4 className="flex items-center gap-2 font-semibold text-slate-950">
                  <BadgeInfo className="h-4 w-4 text-slate-500" /> Candidate Snapshot
                </h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Email</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-950"><Mail className="h-4 w-4 text-slate-500" />{candidate.email}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Phone</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-950"><Phone className="h-4 w-4 text-slate-500" />{candidate.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-border bg-white p-5">
              <div>
                <p className="text-sm text-slate-500">Recruiter Notes</p>
                <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{candidate.notes}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Candidate Details</p>
                <dl className="mt-3 grid gap-2 text-sm text-slate-700">
                  <div className="flex justify-between gap-4"><dt>Email</dt><dd>{candidate.email}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Phone</dt><dd>{candidate.phone}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Role</dt><dd>{candidate.role}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Experience</dt><dd>{candidate.experienceYears} years</dd></div>
                  <div className="flex justify-between gap-4"><dt>Upload Date</dt><dd>{candidate.uploadDate}</dd></div>
                </dl>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Update Status</label>
                <select
                  name="status"
                  aria-label="Update candidate status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as CandidateStatus)}
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"
                >
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DECLINED">Declined</option>
                </select>
                <Button type="button" className="w-full rounded-xl" disabled={isSavingStatus} onClick={() => void saveStatus()}>
                  {isSavingStatus ? "Saving..." : "Save Status"}
                </Button>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
                <label className="text-sm font-medium text-slate-700">Add Note</label>
                <textarea
                  name="note"
                  aria-label="Recruiter note"
                  placeholder="Add recruiter note..."
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="min-h-24 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
                />
                <Button type="button" variant="outline" className="w-full rounded-xl" disabled={isSavingNote} onClick={() => void saveNote()}>
                  {isSavingNote ? "Saving..." : "Save Note"}
                </Button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button asChild className="rounded-xl">
                  <a href={candidate.resumeUrl} download rel="noreferrer">
                    <Download className="h-4 w-4" /> Download Resume
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <a href={`mailto:${candidate.email}`}>
                    <Mail className="h-4 w-4" /> Email Candidate
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
