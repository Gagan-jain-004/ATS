import { NextResponse } from "next/server";
import { enhanceJdIfNeeded } from "@/lib/ai/jd";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const jd = String(payload.jd ?? "").trim();

    if (!jd) {
      return NextResponse.json({ enhancedJd: "" }, { status: 400 });
    }

    const enhanced = await enhanceJdIfNeeded(jd);
    return NextResponse.json({ enhancedJd: enhanced.enhancedJd });
  } catch {
    return NextResponse.json({ enhancedJd: "" }, { status: 500 });
  }
}
