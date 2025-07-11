import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User,{ ISkill,IResume } from "@/models/User";
import mongoose from "mongoose";

// ✅ 5. Update Skills

export async function POST(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, skills } = await req.json();

  if (!userId || !resumeId || !Array.isArray(skills)) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  resume.skills = skills.map((item: ISkill, index: number) => ({ ...item, id: index + 1 }));
  await user.save();

  return NextResponse.json({ success: true, message: "Skills updated", skills: resume.skills });
}