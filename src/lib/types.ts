export type UserRole = "ADMIN" | "RECRUITER";
export type CandidateStatus = "UNREAD" | "READ" | "SHORTLISTED" | "APPROVED" | "DECLINED";

export interface JobSummary {
  id: string;
  title: string;
  city: string;
  createdAt: string;
  resumeCount: number;
  shortlistedCount: number;
  pendingCount: number;
  lastUpdated: string;
  matchScore: number;
  status: "Active" | "Draft";
  description: string;
  originalJd: string;
  enhancedJd: string;
  skills: string[];
  jobEmbedding: number[];
}

export interface CandidateSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  matchPercentage: number;
  skills: string[];
  experienceYears: number;
  status: CandidateStatus;
  uploadDate: string;
  resumeUrl: string;
  notes: string;
  matchedSkills: string[];
  missingSkills: string[];
  parsedText: string;
}

export interface RecruiterNote {
  id: string;
  candidateId: string;
  jobId: string;
  note: string;
  createdAt: string;
}
