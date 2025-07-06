import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation
const atsSchema = z.object({
  resumeText: z.string(),
  keywords: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = atsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const { resumeText, keywords } = parsed.data;

    // Normalize resume text
    const normalized = resumeText.toLowerCase();

    // Find matching keywords
    const matchedKeywords = keywords.filter((kw) =>
      normalized.includes(kw.toLowerCase())
    );

    const matches = matchedKeywords.length;
    const totalKeywords = keywords.length;

    // Calculate ATS score as percentage
    const score =
      totalKeywords > 0 ? Math.round((matches / totalKeywords) * 100) : 0;

    return NextResponse.json({
      success: true,
      atsScore: score,
      matches,
      totalKeywords,
      matchedKeywords,
    });
  } catch (err) {
    console.error("ATS Check Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
