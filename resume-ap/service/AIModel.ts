import { GoogleGenAI } from "@google/genai";

export type SummaryResponse = {
  fresher: string;
  "mid-level": string;
  experienced: string;
  intern: string;
};

export type AIExperience = {
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string; // format YYYY-MM-DD
  endDate: string;   // format YYYY-MM-DD
  currentlyWorking: boolean;
  workSummery: string;
};

export type AIProject = {
  title: string;
  description: string;
  link?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  currentlyWorking: boolean;
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

export async function generateExperience(prompt: string): Promise<AIExperience[]> {
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

  // Strip markdown code fences if present
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
  }

  let parsed: AIExperience[];
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse JSON. Raw text:", rawText);
    throw new Error("Could not parse JSON from Gemini response.");
  }

  return parsed;
}


export async function generateProjects(prompt: string): Promise<AIProject[]> {
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

  // Remove markdown code fences if present
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
  }

  let parsed: AIProject[];
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse JSON from AI response:", rawText);
    throw new Error("Could not parse JSON from Gemini response.");
  }

  return parsed;
}