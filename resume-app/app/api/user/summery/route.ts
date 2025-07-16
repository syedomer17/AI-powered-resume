import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { ISummary, IResume } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, text } = await req.json();

  if (!userId || !resumeId || !text) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  const existingSummaryIndex = resume.summary.findIndex((s: ISummary) => s.id === 1);

  if (existingSummaryIndex !== -1) {
    resume.summary[existingSummaryIndex].text = text;
  } else {
    resume.summary.push({ id: 1, text, resumeId });
  }

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Summary saved or updated",
    summary: resume.summary,
  });
}
