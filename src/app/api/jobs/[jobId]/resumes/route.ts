import { NextRequest, NextResponse } from "next/server";
import { addCandidate, findDuplicateCandidate, getJobById, updateJob } from "@/lib/mock-store";
import { uploadResumeToCloudinary } from "@/lib/cloudinary";
import { extractResumeText, parseResumeText } from "@/lib/resume";
import { generateEmbedding } from "@/lib/ai/embedding";
import { scoreResumeMatch } from "@/lib/ai/matching";
import { hashContent } from "@/lib/hash";

export async function POST(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = await params;
  const job = await getJobById(resolvedParams.jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No resume files provided." }, { status: 400 });
  }

  const processed = [];
  const skipped = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeHash = hashContent(buffer.toString("base64"));
    const parsedText = await extractResumeText(buffer, file.name);
    const profile = parseResumeText(parsedText);
    const duplicate = await findDuplicateCandidate(resolvedParams.jobId, { email: profile.email, phone: profile.phone, resumeHash });

    if (duplicate) {
      skipped.push({ file: file.name, reason: "Duplicate resume detected." });
      continue;
    }

    const resumeEmbedding = await generateEmbedding(parsedText);
    const jobEmbedding = Array.isArray(job.jobEmbedding) ? job.jobEmbedding : [];
    const match = scoreResumeMatch({
      jobTitle: job.title,
      enhancedJd: job.enhancedJd,
      jobSkills: job.skills,
      jobEmbedding,
      resumeText: parsedText,
      resumeSkills: profile.skills,
      resumeEmbedding,
      experienceYears: profile.experienceYears
    });

    let resumeUrl = `/samples/${file.name}`;
    try {
      const uploaded = await uploadResumeToCloudinary(buffer, file.name);
      resumeUrl = uploaded.url;
    } catch {
      // Keep the local preview URL when Cloudinary is not configured.
    }

    const candidate = await addCandidate(resolvedParams.jobId, {
      id: `candidate-${resumeHash.slice(0, 12)}`,
      fullName: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: match.predictedRole,
      matchPercentage: match.matchPercentage,
      skills: profile.skills,
      experienceYears: profile.experienceYears,
      status: "UNREAD",
      uploadDate: new Date().toISOString(),
      resumeUrl,
      notes: "",
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      parsedText
    });

    processed.push({ file: file.name, candidate, match });
  }

  await updateJob(resolvedParams.jobId, {
    resumeCount: (job.resumeCount ?? 0) + processed.length,
    pendingCount: (job.pendingCount ?? 0) + processed.length,
    lastUpdated: "Just now"
  } as never);

  return NextResponse.json({ processed, skipped });
}
