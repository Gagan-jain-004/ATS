import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai/embedding";
import { addJob, getJobs } from "@/lib/mock-store";
import { hashContent } from "@/lib/hash";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "new-job";
}

export async function GET() {
  return NextResponse.json({ jobs: await getJobs() });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    title?: string;
    city?: string;
    skills?: string[];
    experienceYears?: number;
    description?: string;
  };

  const title = String(payload.title ?? "").trim();
  const city = String(payload.city ?? "").trim();
  const skills = Array.isArray(payload.skills) ? payload.skills.map((entry) => String(entry).trim()).filter(Boolean) : [];
  const description = String(payload.description ?? "").trim();
  const experienceYears = Number.isFinite(payload.experienceYears) ? Number(payload.experienceYears) : undefined;

  if (!title || !description) {
    return NextResponse.json({ error: "Job title and description are required." }, { status: 400 });
  }

  const searchableText = [
    `Title: ${title}`,
    city ? `Location: ${city}` : null,
    skills.length ? `Skills: ${skills.join(", ")}` : null,
    typeof experienceYears === "number" ? `Experience: ${experienceYears}+ years` : null,
    `Description: ${description}`
  ].filter(Boolean).join("\n\n");

  const embedding = await generateEmbedding(searchableText);
  const id = `job-${toSlug(title)}-${hashContent(searchableText).slice(0, 8)}`;

  const job = await addJob({
    id,
    title,
    city: city || "Remote",
    createdAt: new Date().toISOString(),
    resumeCount: 0,
    shortlistedCount: 0,
    pendingCount: 0,
    lastUpdated: "Just now",
    matchScore: 0,
    status: "Active",
    description,
    originalJd: description,
    enhancedJd: searchableText,
    skills,
    jobEmbedding: embedding
  });

  return NextResponse.json({ job }, { status: 201 });
}
