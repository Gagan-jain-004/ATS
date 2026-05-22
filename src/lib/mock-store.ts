import dayjs from "dayjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashContent } from "@/lib/hash";
import { generateEmbedding } from "@/lib/ai/embedding";
import { scoreResumeMatch } from "@/lib/ai/matching";
import { type CandidateSummary, type JobSummary } from "@/lib/types";

function getRelativeUpdatedAt(updatedAt: Date) {
  const diffInMinutes = dayjs().diff(updatedAt, "minute");
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = dayjs().diff(updatedAt, "hour");
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${dayjs().diff(updatedAt, "day")}d ago`;
}

async function getAuthenticatedClerkId() {
  const { userId } = await auth();
  return userId ?? null;
}

async function ensureCurrentUserRecord() {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    throw new Error("Authentication required");
  }

  const clerkUser = await currentUser();
  return prisma.user.upsert({
    where: { clerkId },
    update: {
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? `${clerkId}@clerk.local`,
      name: clerkUser?.fullName ?? clerkUser?.firstName ?? "Recruiter"
    },
    create: {
      clerkId,
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? `${clerkId}@clerk.local`,
      name: clerkUser?.fullName ?? clerkUser?.firstName ?? "Recruiter",
      role: "RECRUITER"
    }
  });
}

function mapJobToSummary(job: {
  id: string;
  title: string;
  city: string;
  description: string;
  originalJd: string;
  enhancedJd: string;
  skills: string[];
  jobEmbedding: Prisma.JsonValue | null;
  resumeCount: number;
  shortlistedCount: number;
  pendingCount: number;
  matchScore: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  applications: Array<{ status: string }>;
}): JobSummary {
  const applicationCount = job.applications.length;
  const shortlistedCount = job.applications.filter((application) => application.status === "SHORTLISTED" || application.status === "APPROVED").length;

  return {
    id: job.id,
    title: job.title,
    city: job.city,
    createdAt: dayjs(job.createdAt).format("MMM D, YYYY"),
    resumeCount: job.resumeCount || applicationCount,
    shortlistedCount: job.shortlistedCount || shortlistedCount,
    pendingCount: job.pendingCount || Math.max(applicationCount - shortlistedCount, 0),
    lastUpdated: getRelativeUpdatedAt(job.updatedAt),
    matchScore: job.matchScore,
    status: job.status as JobSummary["status"],
    description: job.description || job.originalJd,
    originalJd: job.originalJd,
    enhancedJd: job.enhancedJd,
    skills: job.skills,
    jobEmbedding: Array.isArray(job.jobEmbedding) ? (job.jobEmbedding as number[]) : []
  };
}

function mapApplicationToCandidateSummary(application: Prisma.ApplicationGetPayload<{ include: { candidate: true } }>): CandidateSummary {
  return {
    id: application.candidate.id,
    fullName: application.candidate.fullName,
    email: application.candidate.email ?? "",
    phone: application.candidate.phone ?? "",
    role: application.predictedRole ?? application.candidate.education ?? "Candidate",
    matchPercentage: application.matchPercentage,
    skills: application.candidate.skills,
    experienceYears: application.candidate.experienceYears ?? 0,
    status: application.status,
    uploadDate: getRelativeUpdatedAt(application.createdAt),
    resumeUrl: application.candidate.resumeUrl,
    notes: application.notes ?? "",
    matchedSkills: application.matchedSkills,
    missingSkills: application.missingSkills,
    parsedText: application.candidate.parsedText
  };
}

export async function getJobs() {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return [];
  }

  const jobs = await prisma.job.findMany({
    where: { owner: { clerkId } },
    orderBy: { updatedAt: "desc" },
    include: {
      applications: {
        select: { status: true }
      }
    }
  });

  return jobs.map(mapJobToSummary);
}

export async function getJobById(jobId: string) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return undefined;
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      owner: { clerkId }
    },
    include: {
      applications: {
        select: { status: true }
      }
    }
  });

  if (!job) return undefined;

  return mapJobToSummary(job);
}

export async function getCandidates(jobId: string) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return [];
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      owner: { clerkId }
    },
    select: { id: true }
  });

  if (!job) {
    return [];
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      candidate: true
    },
    orderBy: [{ matchPercentage: "desc" }, { createdAt: "desc" }]
  });

  return applications.map(mapApplicationToCandidateSummary);
}

export async function getCandidateById(jobId: string, candidateId: string) {
  const candidates = await getCandidates(jobId);
  return candidates.find((candidate) => candidate.id === candidateId);
}

export async function getCandidateByIdAnyJob(candidateId: string) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return undefined;
  }

  const application = await prisma.application.findFirst({
    where: {
      candidateId,
      job: { owner: { clerkId } }
    },
    include: {
      candidate: true
    }
  });

  if (!application) {
    return undefined;
  }

  return mapApplicationToCandidateSummary(application);
}

export async function getCandidateAndJobByIdAnyJob(candidateId: string) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return undefined;
  }

  const application = await prisma.application.findFirst({
    where: {
      candidateId,
      job: { owner: { clerkId } }
    },
    include: {
      candidate: true,
      job: { select: { id: true } }
    }
  });

  if (!application) {
    return undefined;
  }

  return {
    jobId: application.job.id,
    candidate: mapApplicationToCandidateSummary(application)
  };
}

export async function addJob(job: JobSummary) {
  const owner = await ensureCurrentUserRecord();
  const createdJob = await prisma.job.create({
    data: {
      id: job.id,
      title: job.title,
      city: job.city,
      createdAt: new Date(job.createdAt),
      description: job.description,
      originalJd: job.originalJd,
      enhancedJd: job.enhancedJd,
      skills: job.skills,
      jobEmbedding: job.jobEmbedding as Prisma.InputJsonValue | undefined,
      resumeCount: job.resumeCount,
      shortlistedCount: job.shortlistedCount,
      pendingCount: job.pendingCount,
      matchScore: job.matchScore,
      status: job.status,
      ownerId: owner.id
    }
  });

  return mapJobToSummary({
    ...createdJob,
    applications: []
  });
}

export async function updateJob(jobId: string, patch: Partial<JobSummary>) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return undefined;
  }

  const enhancedJd = patch.enhancedJd ?? patch.originalJd;
  const updated = await prisma.job.updateMany({
    where: {
      id: jobId,
      owner: { clerkId }
    },
    data: {
      title: patch.title,
      city: patch.city,
      description: patch.description,
      originalJd: patch.originalJd,
      enhancedJd,
      skills: patch.skills,
      jobEmbedding: patch.jobEmbedding as Prisma.InputJsonValue | undefined,
      resumeCount: patch.resumeCount,
      shortlistedCount: patch.shortlistedCount,
      pendingCount: patch.pendingCount,
      matchScore: patch.matchScore,
      status: patch.status
    }
  });

  if (!updated.count) {
    return undefined;
  }

  return getJobById(jobId);
}

export async function updateCandidate(jobId: string, candidateId: string, patch: Partial<CandidateSummary>) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return undefined;
  }

  const application = await prisma.application.updateMany({
    where: {
      jobId,
      candidateId,
      job: { owner: { clerkId } }
    },
    data: {
      status: patch.status,
      notes: patch.notes
    }
  });

  if (!application.count) {
    return undefined;
  }

  return getCandidateById(jobId, candidateId);
}

export async function addCandidate(jobId: string, candidate: CandidateSummary) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    throw new Error("Authentication required");
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      owner: { clerkId }
    },
    select: { id: true }
  });

  if (!job) {
    throw new Error("Job not found");
  }

  const resumeHash = hashContent(candidate.id);
  const storedCandidate = await prisma.candidate.upsert({
    where: { resumeHash },
    update: {
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      parsedText: candidate.parsedText,
      skills: candidate.skills,
      experienceYears: candidate.experienceYears,
      education: candidate.role,
      embedding: candidate.parsedText ? [candidate.matchPercentage / 100] : undefined
    },
    create: {
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      resumeHash,
      parsedText: candidate.parsedText,
      skills: candidate.skills,
      experienceYears: candidate.experienceYears,
      education: candidate.role,
      embedding: candidate.parsedText ? [candidate.matchPercentage / 100] : undefined
    }
  });

  await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: storedCandidate.id,
        jobId
      }
    },
    update: {
      matchPercentage: candidate.matchPercentage,
      matchedSkills: candidate.matchedSkills,
      missingSkills: candidate.missingSkills,
      predictedRole: candidate.role,
      status: candidate.status,
      notes: candidate.notes
    },
    create: {
      candidateId: storedCandidate.id,
      jobId,
      matchPercentage: candidate.matchPercentage,
      matchedSkills: candidate.matchedSkills,
      missingSkills: candidate.missingSkills,
      predictedRole: candidate.role,
      status: candidate.status,
      notes: candidate.notes
    }
  });

  return candidate;
}

export async function findDuplicateCandidate(jobId: string, candidate: Pick<CandidateSummary, "email" | "phone"> & { resumeHash?: string }) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return undefined;
  }

  const duplicate = await prisma.application.findFirst({
    where: {
      jobId,
      job: { owner: { clerkId } },
      OR: [
        candidate.email ? { candidate: { email: candidate.email } } : undefined,
        candidate.phone ? { candidate: { phone: candidate.phone } } : undefined,
        candidate.resumeHash ? { candidate: { resumeHash: candidate.resumeHash } } : undefined
      ].filter(Boolean) as Prisma.ApplicationWhereInput[]
    },
    include: {
      candidate: true
    }
  });

  if (!duplicate) return undefined;

  return mapApplicationToCandidateSummary(duplicate);
}

export async function deleteJob(jobId: string) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return false;
  }

  const deleted = await prisma.job.deleteMany({
    where: {
      id: jobId,
      owner: { clerkId }
    }
  });

  return deleted.count > 0;
}

export function buildSearchableJobText(input: {
  title: string;
  city: string;
  skills: string[];
  experienceYears?: number;
  description: string;
}) {
  return [
    `Title: ${input.title}`,
    input.city ? `Location: ${input.city}` : null,
    input.skills.length ? `Skills: ${input.skills.join(", ")}` : null,
    typeof input.experienceYears === "number" ? `Experience: ${input.experienceYears}+ years` : null,
    `Description: ${input.description}`
  ].filter(Boolean).join("\n\n");
}

export async function refreshJobCandidateMatches(jobId: string) {
  const clerkId = await getAuthenticatedClerkId();
  if (!clerkId) {
    return false;
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      owner: { clerkId }
    },
    include: {
      applications: {
        include: {
          candidate: true
        }
      }
    }
  });

  if (!job) {
    return false;
  }

  const jobEmbedding = Array.isArray(job.jobEmbedding) ? (job.jobEmbedding as number[]) : [];
  const updatedApplications = await Promise.all(
    job.applications.map(async (application) => {
      const resumeText = application.candidate.parsedText;
      const resumeEmbedding = await generateEmbedding(resumeText);
      const match = scoreResumeMatch({
        jobTitle: job.title,
        enhancedJd: job.enhancedJd,
        jobSkills: job.skills,
        jobEmbedding,
        resumeText,
        resumeSkills: application.candidate.skills,
        resumeEmbedding,
        experienceYears: application.candidate.experienceYears ?? 0
      });

      await prisma.application.update({
        where: {
          candidateId_jobId: {
            candidateId: application.candidateId,
            jobId: application.jobId
          }
        },
        data: {
          matchPercentage: match.matchPercentage,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          predictedRole: match.predictedRole
        }
      });

      return match.matchPercentage;
    })
  );

  await prisma.job.update({
    where: { id: job.id },
    data: {
      matchScore: updatedApplications.length ? Math.max(...updatedApplications) : 0
    }
  });

  return true;
}
