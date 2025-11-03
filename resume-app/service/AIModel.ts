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
  techStack: string;
  description: string;
  link?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  currentlyWorking: boolean;
};

export type AIResumeContent = {
  summary: string;
  experience: AIExperience[];
  projects: AIProject[];
  skills: string[];
};

export type ATSScoreResponse = {
  score: number; // 0-100
  matchPercentage: number; // 0-100
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: {
    category: string;
    recommendation: string;
    priority: "high" | "medium" | "low";
  }[];
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

export async function generateResumeFromJobDescription(
  jobTitle: string, 
  jobDescription: string
): Promise<AIResumeContent> {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  });

  const prompt = `Based on the following job title and description, generate a complete resume content in JSON format.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Generate:
1. A professional summary (200-250 words) that highlights relevant skills and experience for this role
2. 2-3 relevant work experiences with realistic details (title, company, dates, responsibilities)
3. 2-3 relevant projects with descriptions
4. A list of 8-12 relevant technical skills

Return ONLY valid JSON in this exact format:
{
  "summary": "professional summary text here",
  "experience": [
    {
      "title": "job title",
      "companyName": "company name",
      "city": "city",
      "state": "state",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "currentlyWorking": false,
      "workSummery": "detailed work summary"
    }
  ],
  "projects": [
    {
      "title": "project title",
      "description": "project description",
      "link": "https://example.com",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "currentlyWorking": false
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}`;

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

  let parsed: AIResumeContent;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse JSON from AI response:", rawText);
    throw new Error("Could not parse JSON from Gemini response.");
  }

  return parsed;
}

export async function analyzeResumeATS(
  resumeData: {
    title: string;
    summary: string;
    experience: AIExperience[];
    projects: AIProject[];
    skills: string[];
    education?: any[];
  },
  jobDescription: string
): Promise<ATSScoreResponse> {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  });

  const resumeText = `
Resume Title: ${resumeData.title}
Summary: ${resumeData.summary}
Experience: ${JSON.stringify(resumeData.experience, null, 2)}
Projects: ${JSON.stringify(resumeData.projects, null, 2)}
Skills: ${resumeData.skills.join(", ")}
Education: ${resumeData.education ? JSON.stringify(resumeData.education, null, 2) : "Not provided"}
  `.trim();

  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume (raw text) against the job description and provide a detailed ATS score and improvement suggestions.

Job Description:
${jobDescription}

Resume:
${resumeText}

Analyze the resume and provide:
1. An ATS score (0-100) based on keyword matching, formatting, and relevance
2. A match percentage showing how well the resume aligns with the job description
3. List of strengths (what the resume does well)
4. List of improvements needed
5. Missing keywords that should be added
6. Specific actionable suggestions with priority levels

Return ONLY valid JSON in this exact format:
{
  "score": number,
  "matchPercentage": number,
  "strengths": [
    "example strength 1",
    "example strength 2"
  ],
  "improvements": [
    "example improvement 1",
    "example improvement 2"
  ],
  "missingKeywords": [
    "exampleKeyword1",
    "exampleKeyword2"
  ],
  "suggestions": [
    {
      "category": "Skills",
      "recommendation": "example recommendation",
      "priority": "high"
    },
    {
      "category": "Experience",
      "recommendation": "example recommendation",
      "priority": "medium"
    }
  ]
}`;

  // Retry logic with exponential backoff for 503 errors
  let response;
  let lastError;
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });
      break; // Success, exit retry loop
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a 503 or overload error
      if (error?.status === 503 || error?.message?.includes("overloaded")) {
        if (attempt < maxRetries) {
          // Wait with exponential backoff: 2s, 4s, 8s
          const waitTime = Math.pow(2, attempt) * 1000;
          // console.log(`Model overloaded, retrying in ${waitTime/1000}s... (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      // If not 503 or max retries reached, throw error
      throw error;
    }
  }

  if (!response) {
    throw lastError || new Error("Failed to get response from Gemini after retries");
  }

  let rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!rawText) {
    throw new Error("Gemini response did not contain text.");
  }

  // Strip markdown code fences if present
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
  }

  let parsed: ATSScoreResponse;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse JSON from AI response:", rawText);
    throw new Error("Could not parse JSON from Gemini response.");
  }

  return parsed;
}

export async function analyzeResumeTextATS(
  resumeText: string,
  jobDescription: string
): Promise<ATSScoreResponse> {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  });

  const prompt = `
You are an ATS (Applicant Tracking System) expert. Analyze the following resume (raw text) against the job description and provide a detailed ATS score and improvement suggestions.

Job Description:
${jobDescription}

Resume (raw text):
${resumeText}

Analyze the resume and provide:
1. An ATS score (0-100) based on keyword matching, formatting, and relevance.
2. A match percentage (0-100) showing how well the resume aligns with the job description.
3. List of strengths (what the resume does well).
4. List of improvements needed.
5. Missing keywords that should be added.
6. Specific actionable suggestions with priority levels.

Return ONLY valid JSON in this format (replace example values with actual analysis results):
{
  "score": number,
  "matchPercentage": number,
  "strengths": [
    "example strength 1",
    "example strength 2"
  ],
  "improvements": [
    "example improvement 1",
    "example improvement 2"
  ],
  "missingKeywords": [
    "exampleKeyword1",
    "exampleKeyword2"
  ],
  "suggestions": [
    {
      "category": "Skills",
      "recommendation": "example recommendation",
      "priority": "high"
    },
    {
      "category": "Experience",
      "recommendation": "example recommendation",
      "priority": "medium"
    }
  ]
}
`;

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

  let parsed: ATSScoreResponse;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse JSON from AI response:", rawText);
    throw new Error("Could not parse JSON from Gemini response.");
  }

  return parsed;
}

