import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IEducation, IResume } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, education } = await req.json();

  if (!userId || !resumeId || !Array.isArray(education)) {
    return NextResponse.json(
      { success: false, message: "Missing fields or invalid education array" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) {
    return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });
  }

  resume.education = education.map((item: IEducation, index: number) => ({
    ...item,
    id: index + 1,
  }));

  await user.save();

  return NextResponse.json({ success: true, message: "Education updated", education: resume.education });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, educationId } = await req.json();

  if (!userId || !resumeId || !educationId) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
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

  const resumeIndex = user.resumes.findIndex(
    (r: IResume) => r._id?.toString() === resumeId
  );

  if (resumeIndex === -1) {
    return NextResponse.json(
      { success: false, message: "Resume not found" },
      { status: 404 }
    );
  }

  const resume = user.resumes[resumeIndex];
  if (!resume.education || resume.education.length === 0) {
    return NextResponse.json(
      { success: false, message: "No education records found" },
      { status: 404 }
    );
  }

  resume.education = resume.education.filter(
    (edu:IEducation) => String(edu.id) !== String(educationId)
  );

  // Mark modified so Mongoose saves it
  user.markModified(`resumes.${resumeIndex}.education`);

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Education removed successfully",
    education: resume.education,
  });
}