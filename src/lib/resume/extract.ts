import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const knownSkills = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Java",
  "Spring Boot",
  "Microservices",
  "Kafka",
  "AWS",
  "Figma",
  "Design Systems",
  "Accessibility",
  "UX Research",
  "Motion",
  "Branding",
  "SQL",
  "PostgreSQL",
  "REST APIs",
  "Docker",
  "Kubernetes"
];

export interface ParsedResumeProfile {
  rawText: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experienceYears: number;
  education: string;
}

function extractName(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines[0]?.replace(/[^a-zA-Z.\-\s]/g, "").trim() || "Unknown Candidate";
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function extractPhone(text: string) {
  return text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?){2,4}\d{2,4}/)?.[0] ?? "";
}

function extractExperienceYears(text: string) {
  const matches = [...text.matchAll(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)/gi)].map(([value]) => Number.parseFloat(value));
  return matches.length ? Math.max(...matches) : 0;
}

function extractSkills(text: string) {
  const lower = text.toLowerCase();
  return knownSkills.filter((skill) => lower.includes(skill.toLowerCase()));
}

function extractEducation(text: string) {
  const line = text.split(/\r?\n/).find((entry) => /education|bachelor|master|degree|b\.tech|m\.tech|mba/i.test(entry));
  return line?.trim() || "";
}

export function parseResumeText(text: string): ParsedResumeProfile {
  return {
    rawText: text,
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    experienceYears: extractExperienceYears(text),
    education: extractEducation(text)
  };
}

export async function extractResumeText(fileBuffer: Buffer, fileName: string) {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith(".pdf")) {
    const parsed = await pdfParse(fileBuffer);
    return parsed.text;
  }

  if (lowerName.endsWith(".docx") || lowerName.endsWith(".doc")) {
    const parsed = await mammoth.extractRawText({ buffer: fileBuffer });
    return parsed.value;
  }

  return fileBuffer.toString("utf8");
}
