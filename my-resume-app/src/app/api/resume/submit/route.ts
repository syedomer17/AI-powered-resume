import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Submission } from "@/models/submissionModel";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  resumeId: z.string(),
  companies: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const { userId, resumeId, companies } = parsed.data;

  const submissions = await Promise.all(
    companies.map(async (company) => {
      const status = Math.random() > 0.2 ? "submitted" : "error";
      return Submission.create({
        user: userId,
        resume: resumeId,
        company,
        status,
        response: status === "submitted" ? "Resume submitted successfully." : "Submission failed.",
      });
    })
  );

  return NextResponse.json({ success: true, submissions });
}
