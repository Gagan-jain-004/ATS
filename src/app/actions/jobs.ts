"use server";

import { redirect } from "next/navigation";
import { enhanceJdIfNeeded } from "@/lib/ai/jd";
import { addJob, updateCandidate, updateJob } from "@/lib/mock-store";
import { type JobSummary } from "@/lib/types";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "new-job";
}

function inferTitle(jd: string) {
  const firstLine = jd.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? jd.trim();
  return firstLine.replace(/[:.]+$/, "").slice(0, 60);
}

export async function createJobAction(formData: FormData) {
  const jd = String(formData.get("jd") ?? "").trim();
  if (!jd) {
    return;
  }

  const enhanced = await enhanceJdIfNeeded(jd);
  const title = inferTitle(jd);
  const id = `job-${toSlug(title)}-${Date.now().toString(36)}`;

  const createdJob: JobSummary = {
    id,
    title,
    city: "Remote",
    createdAt: new Date().toISOString(),
    resumeCount: 0,
    shortlistedCount: 0,
    pendingCount: 0,
    lastUpdated: "Just now",
    matchScore: 0,
    status: "Active",
    description: jd,
    originalJd: jd,
    enhancedJd: enhanced.enhancedJd,
    skills: enhanced.enhancedJd
      .split(/[,\n]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 8),
    jobEmbedding: enhanced.embedding
  };

  await addJob(createdJob);
  redirect(`/dashboard/jobs/${id}`);
}

export async function updateJobAction(formData: FormData) {
  const jobId = String(formData.get("jobId") ?? "");
  const jd = String(formData.get("jd") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (!jobId || !jd) {
    return;
  }

  const enhanced = await enhanceJdIfNeeded(jd);
  await updateJob(jobId, {
    title: title || inferTitle(jd),
    originalJd: jd,
    enhancedJd: enhanced.enhancedJd,
    jobEmbedding: enhanced.embedding,
    lastUpdated: "Just now"
  });

  redirect(`/dashboard/jobs/${jobId}`);
}

export async function updateCandidateStatusAction(formData: FormData) {
  const jobId = String(formData.get("jobId") ?? "");
  const candidateId = String(formData.get("candidateId") ?? "");
  const status = String(formData.get("status") ?? "UNREAD");

  if (!jobId || !candidateId) {
    return;
  }

  await updateCandidate(jobId, candidateId, { status: status as never });
  redirect(`/dashboard/jobs/${jobId}`);
}
