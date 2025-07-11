import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { IEducation ,IResume} from "@/models/User";

// ✅ 2. Update Education by Resume ID

export async function POST(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, education } = await req.json();

  if (!userId || !resumeId || !Array.isArray(education)) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  resume.education = education.map((item: IEducation, index: number) => ({ ...item, id: index + 1 }));
  await user.save();

  return NextResponse.json({ success: true, message: "Education updated", education: resume.education });
}