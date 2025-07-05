import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const atsSchema = z.object({
  resumeText: z.string(),
  keywords: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = atsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.errors }, { status: 400 });
  }

  const { resumeText, keywords } = parsed.data;

  // Simple scoring logic: count keyword matches
  const normalized = resumeText.toLowerCase();
  let matches = 0;

  keywords.forEach((kw) => {
    if (normalized.includes(kw.toLowerCase())) {
      matches++;
    }
  });

  const score = Math.round((matches / keywords.length) * 100);

  return NextResponse.json({
    success: true,
    atsScore: score,
    matches,
    totalKeywords: keywords.length,
  });
}
