import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title } = await req.json();

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured." },
      { status: 500 }
    );
  }

  const prompt = `Generate 4 resume summary examples for a "${title}" resume: one junior, one mid level, one senior, and one intern.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    // Split into 4 suggestions
    const summaries = text
      .split(/\n\n+/)
      .map((s: string) => s.trim())
      .filter(Boolean);

    return NextResponse.json({ summaries });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Failed to generate summaries." },
      { status: 500 }
    );
  }
}
