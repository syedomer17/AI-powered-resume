import { GoogleGenAI } from "@google/genai";

export type SummaryResponse = {
  fresher: string;
  "mid-level": string;
  experienced: string;
  intern: string;
};

export async function generateSummary(prompt: string): Promise<SummaryResponse> {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  let rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!rawText) {
    throw new Error("Gemini response did not contain text.");
  }

  // ✅ Strip markdown code fences if present
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
  }

  let parsed: SummaryResponse;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("❌ Failed to parse JSON. Raw text:", rawText);
    throw new Error("Could not parse JSON from Gemini response.");
  }

  return parsed;
}
