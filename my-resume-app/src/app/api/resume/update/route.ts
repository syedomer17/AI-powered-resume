import { NextRequest, NextResponse } from "next/server";
import { generateResume } from "@/lib/gemini";
import clientPromise from "@/lib/mongodb";
import { Resume } from "@/models/resumeModel";
import { z } from "zod";

const schema = z.object({
  resumeId: z.string(),
  additionalInfo: z.string(),
});

export async function POST(req: NextRequest) {
  await clientPromise();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const { resumeId, additionalInfo } = parsed.data;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const prompt = `Here is the existing resume:\n\n${resume.content}\n\nPlease update and improve it by adding:\n${additionalInfo}`;

  const updatedContent = await generateResume(prompt);

  resume.content = updatedContent;
  resume.updatedByAI = true;
  await resume.save();

  return NextResponse.json({ success: true, resume });
}
