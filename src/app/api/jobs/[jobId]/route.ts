import { NextRequest, NextResponse } from "next/server";
import { buildSearchableJobText, deleteJob, getCandidates, getJobById, refreshJobCandidateMatches, updateJob } from "@/lib/mock-store";
import { generateEmbedding } from "@/lib/ai/embedding";
import { type JobSummary } from "@/lib/types";

function parseJobStatus(value: unknown): JobSummary["status"] {
  return value === "Draft" ? "Draft" : "Active";
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = await params;
  const job = await getJobById(resolvedParams.jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ job, candidates: await getCandidates(resolvedParams.jobId) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = await params;
  const payload = (await request.json()) as {
    title?: string;
    city?: string;
    skills?: string[];
    experienceYears?: number;
    description?: string;
    status?: string;
    resumeCount?: number;
    shortlistedCount?: number;
    pendingCount?: number;
    matchScore?: number;
  };

  const title = String(payload.title ?? "").trim();
  const city = String(payload.city ?? "").trim();
  const skills = Array.isArray(payload.skills) ? payload.skills.map((entry) => String(entry).trim()).filter(Boolean) : [];
  const description = String(payload.description ?? "").trim();
  const experienceYears = Number.isFinite(payload.experienceYears) ? Number(payload.experienceYears) : undefined;
  const status = parseJobStatus(payload.status);
  const resumeCount = Number.isFinite(payload.resumeCount) ? Number(payload.resumeCount) : undefined;
  const shortlistedCount = Number.isFinite(payload.shortlistedCount) ? Number(payload.shortlistedCount) : undefined;
  const pendingCount = Number.isFinite(payload.pendingCount) ? Number(payload.pendingCount) : undefined;
  const matchScore = Number.isFinite(payload.matchScore) ? Number(payload.matchScore) : undefined;

  if (!title || !description) {
    return NextResponse.json({ error: "Job title and description are required." }, { status: 400 });
  }

  const searchableText = buildSearchableJobText({
    title,
    city,
    skills,
    experienceYears,
    description
  });

  const embedding = await generateEmbedding(searchableText);
  const job = await updateJob(resolvedParams.jobId, {
    title,
    city: city || "Remote",
    description,
    originalJd: description,
    enhancedJd: searchableText,
    skills,
    jobEmbedding: embedding,
    lastUpdated: "Just now"
    ,
    status,
    resumeCount,
    shortlistedCount,
    pendingCount,
    matchScore
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await refreshJobCandidateMatches(resolvedParams.jobId);

  return NextResponse.json({ job });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = await params;
  const deleted = await deleteJob(resolvedParams.jobId);

  if (!deleted) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
