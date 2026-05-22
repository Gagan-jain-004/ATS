import { cosineSimilarity } from "@/lib/ai/embedding";
import { knownSkills } from "@/lib/resume/extract";

function normalizeSkills(skills: string[]) {
  return skills.map((skill) => skill.toLowerCase().trim());
}

function skillOverlap(jobSkills: string[], resumeSkills: string[]) {
  const normalizedJobSkills = normalizeSkills(jobSkills);
  const normalizedResumeSkills = normalizeSkills(resumeSkills);
  const matched = knownSkills.filter((skill) =>
    normalizedJobSkills.includes(skill.toLowerCase()) && normalizedResumeSkills.includes(skill.toLowerCase())
  );
  const missing = knownSkills.filter((skill) =>
    normalizedJobSkills.includes(skill.toLowerCase()) && !normalizedResumeSkills.includes(skill.toLowerCase())
  );

  return { matched, missing };
}

function experienceScore(jobText: string, experienceYears: number) {
  const requiredYearsMatch = jobText.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
  const requiredYears = requiredYearsMatch ? Number(requiredYearsMatch[1]) : 3;
  const ratio = Math.min(experienceYears / requiredYears, 1.3);
  return Math.max(0, Math.min(1, ratio));
}

export interface MatchingInput {
  jobTitle: string;
  enhancedJd: string;
  jobSkills: string[];
  jobEmbedding: number[];
  resumeText: string;
  resumeSkills: string[];
  resumeEmbedding: number[];
  experienceYears: number;
}

export function scoreResumeMatch(input: MatchingInput) {
  const semanticSimilarity = cosineSimilarity(input.jobEmbedding, input.resumeEmbedding);
  const { matched, missing } = skillOverlap(input.jobSkills, input.resumeSkills);
  const jobSkillsCount = Math.max(input.jobSkills.length, 1);
  const skillScore = matched.length / jobSkillsCount;
  const experienceSimilarity = experienceScore(input.enhancedJd, input.experienceYears);

  const composite = semanticSimilarity * 0.5 + skillScore * 0.35 + experienceSimilarity * 0.15;
  const matchPercentage = Math.max(0, Math.min(100, Math.round(composite * 100)));
  const predictedRole = input.jobTitle.replace(/\bHiring\b/i, "").trim() || input.jobTitle;

  return {
    matchPercentage,
    matchedSkills: matched,
    missingSkills: missing,
    predictedRole,
    semanticSimilarity: Number((semanticSimilarity * 100).toFixed(1)),
    skillScore: Number((skillScore * 100).toFixed(1)),
    experienceScore: Number((experienceSimilarity * 100).toFixed(1))
  };
}
