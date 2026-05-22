"use server";

import { redirect } from "next/navigation";
import { updateCandidate } from "@/lib/mock-store";

export async function addRecruiterNoteAction(formData: FormData) {
  const jobId = String(formData.get("jobId") ?? "");
  const candidateId = String(formData.get("candidateId") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!jobId || !candidateId || !note) {
    return;
  }

  await updateCandidate(jobId, candidateId, { notes: note });
  redirect(`/dashboard/jobs/${jobId}`);
}
