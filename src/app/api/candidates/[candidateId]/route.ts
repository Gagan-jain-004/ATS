import { NextRequest, NextResponse } from "next/server";
import { getCandidateAndJobByIdAnyJob, updateCandidate } from "@/lib/mock-store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ candidateId: string }> }) {
  const resolvedParams = await params;
  const result = await getCandidateAndJobByIdAnyJob(resolvedParams.candidateId);
  if (result) {
    return NextResponse.json({ jobId: result.jobId, candidate: result.candidate });
  }

  return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ candidateId: string }> }) {
  const resolvedParams = await params;
  const payload = (await request.json()) as { jobId?: string; status?: string; notes?: string };
  const jobId = String(payload.jobId ?? "");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required." }, { status: 400 });
  }

  const candidate = await updateCandidate(jobId, resolvedParams.candidateId, {
    status: (payload.status as never) ?? undefined,
    notes: payload.notes ?? undefined
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate });
}
