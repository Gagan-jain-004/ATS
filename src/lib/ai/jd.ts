import { generateEmbedding } from "@/lib/ai/embedding";
import { knownSkills } from "@/lib/resume/extract";

const detailedThreshold = 8;

function shouldEnhanceJd(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const hasEnoughSkills = knownSkills.some((skill) => text.toLowerCase().includes(skill.toLowerCase()));
  return words.length < detailedThreshold || !hasEnoughSkills;
}

export async function enhanceJdIfNeeded(originalJd: string) {
  if (!shouldEnhanceJd(originalJd)) {
    return {
      enhancedJd: originalJd,
      shouldEnhance: false,
      embedding: await generateEmbedding(originalJd)
    };
  }

  const keywordSet = new Set<string>();
  for (const skill of knownSkills) {
    if (originalJd.toLowerCase().includes(skill.toLowerCase())) {
      keywordSet.add(skill);
    }
  }

  const assistantDraft = [
    originalJd,
    "Required capabilities:",
    keywordSet.size ? Array.from(keywordSet).join(", ") : "Core product engineering, collaboration, and ownership.",
    "Seniority: 5+ years experience.",
    "Expectations: delivery, communication, and hands-on ownership."
  ].join(" ");

  return {
    enhancedJd: assistantDraft,
    shouldEnhance: true,
    embedding: await generateEmbedding(assistantDraft)
  };
}
