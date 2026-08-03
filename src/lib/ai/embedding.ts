import { hashContent } from "@/lib/hash";

const embeddingCache = new Map<string, number[]>();

function normalizeVector(values: number[]) {
  const length = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!length) {
    return values;
  }

  return values.map((value) => Number((value / length).toFixed(6)));
}

function localEmbedding(text: string, dimensions = 64) {
  const buckets = Array.from({ length: dimensions }, () => 0);
  const tokens = text.toLowerCase().match(/[a-z0-9+.#-]{2,}/g) ?? [];

  for (const token of tokens) {
    const digest = hashContent(token);
    const index = Number.parseInt(digest.slice(0, 8), 16) % dimensions;
    buckets[index] += 1;
  }

  return normalizeVector(buckets);
}

async function groqRewrite(text: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return text;
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.GROQ_CHAT_MODEL ?? "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Condense recruiter text into a dense skill-rich paragraph focused on technology, scope, seniority, and hiring intent."
        },
        { role: "user", content: text }
      ],
      temperature: 0.1
    })
  });

  if (!response.ok) {
    return text;
  }

  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return payload.choices?.[0]?.message?.content?.trim() || text;
}

export async function generateEmbedding(text: string) {
  const cacheKey = hashContent(text);
  const cached = embeddingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const hasOllamaUrl = !!process.env.OLLAMA_BASE_URL;

  if (!isProduction || hasOllamaUrl) {
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
    const model = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";

    try {
      const response = await fetch(`${ollamaBaseUrl}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: text })
      });

      if (response.ok) {
        const payload = (await response.json()) as { embedding?: number[] };
        if (payload.embedding?.length) {
          embeddingCache.set(cacheKey, payload.embedding);
          return payload.embedding;
        }
      }
    } catch {
      // fallback below
    }
  }

  const expanded = await groqRewrite(text);
  const fallback = localEmbedding(expanded);
  embeddingCache.set(cacheKey, fallback);
  return fallback;
}

export function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.max(left.length, right.length);
  if (!length) {
    return 0;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}
