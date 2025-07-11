import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User,{IExperience,IResume} from "@/models/User";
import mongoose from "mongoose";

// ✅ 3. Update Experience by Resume ID
export async function POST(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, experience } = await req.json();

  if (!userId || !resumeId || !Array.isArray(experience)) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  resume.experience = experience.map((item: IExperience, index: number) => ({ ...item, id: index + 1 }));
  await user.save();

  return NextResponse.json({ success: true, message: "Experience updated", experience: resume.experience });
}