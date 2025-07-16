import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IResume } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const {
    userId,
    resumeId,
    firstName,
    lastName,
    jobTitle,
    address,
    phone,
    email,
    themeColor,
  } = body;

  if (!userId || !resumeId) {
    return NextResponse.json(
      { success: false, message: "Missing userId or resumeId" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const resume = user.resumes.find(
    (r: IResume) => r._id?.toString() === resumeId
  );
  if (!resume) {
    return NextResponse.json(
      { success: false, message: "Resume not found" },
      { status: 404 }
    );
  }

  // Get existing personal details or create default
  const existingDetails = resume.personalDetails?.[0] || {
    id: 1,
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
    themeColor: "#ff6666",
  };

  // Update personalDetails array with one object, merging fields and themeColor
  resume.personalDetails = [
    {
      id: existingDetails.id ?? 1,
      firstName: firstName ?? existingDetails.firstName,
      lastName: lastName ?? existingDetails.lastName,
      jobTitle: jobTitle ?? existingDetails.jobTitle,
      address: address ?? existingDetails.address,
      phone: phone ?? existingDetails.phone,
      email: email ?? existingDetails.email,
      themeColor: themeColor ?? existingDetails.themeColor,
    },
  ];

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Personal details and theme color saved or updated",
    resume,
  });
}
