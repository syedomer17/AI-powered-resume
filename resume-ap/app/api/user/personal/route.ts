import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IPersonalDetails, IResume } from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const { userId, resumeId, firstName, lastName, jobTitle, address, phone, email, themeColor } = body;

  if (!userId || !resumeId) return NextResponse.json({ success: false, message: "Missing userId or resumeId" }, { status: 400 });

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  const nextId = (resume.personalDetails?.[resume.personalDetails.length - 1]?.id || 0) + 1;

  const newDetail: IPersonalDetails = {
    id: nextId,
    firstName,
    lastName,
    jobTitle,
    address,
    phone,
    email,
    themeColor: themeColor || "#ff6666",
  };

  resume.personalDetails.push(newDetail);
  await user.save();

  return NextResponse.json({ success: true, message: "Personal details saved", personalDetails: resume.personalDetails });
}