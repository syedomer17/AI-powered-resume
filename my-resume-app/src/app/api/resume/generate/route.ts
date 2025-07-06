import { NextRequest, NextResponse } from "next/server";
import { generateResume } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/resumeModel";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  jobTitle: z.string(),
  skills: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const { userId, jobTitle, skills } = parsed.data;

  const prompt = `Generate a professional resume for a ${jobTitle} highlighting these skills: ${skills.join(", ")}`;

  const aiResume = await generateResume(prompt);

  const newResume = await Resume.create({
    user: userId,
    content: aiResume,
    aiGenerated: true,
  });

  return NextResponse.json({ success: true, resume: newResume });
}
