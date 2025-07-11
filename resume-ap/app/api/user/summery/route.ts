import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { ISummary,IResume } from "@/models/User"; // confirm model import
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, text } = await req.json();

  if (!userId || !resumeId || !text) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  const nextId = (resume.summary?.[resume.summary.length - 1]?.id || 0) + 1;
  const newSummary: ISummary = { id: nextId, text, resumeId };
  resume.summary.push(newSummary);
  await user.save();

  return NextResponse.json({ success: true, message: "Summary saved", summary: resume.summary });
}