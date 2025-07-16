
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IExperience, IResume } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, experience } = await req.json();

  if (!userId || !resumeId || !Array.isArray(experience)) {
    return NextResponse.json({
      success: false,
      message: "Missing fields or invalid experience array",
    }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume) return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

  resume.experience = experience.map((item: IExperience, index: number) => ({
    ...item,
    id: index + 1,
  }));

  await user.save();

  return NextResponse.json({ success: true, message: "Experience updated", experience: resume.experience });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();

  const { userId, resumeId, experienceId } = await req.json();

  if (!userId || !resumeId || !experienceId) {
    return NextResponse.json(
      { success: false, message: "Missing userId, resumeId, or experienceId" },
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

  resume.experience = resume.experience.filter(
    (exp:IExperience) => String(exp.id) !== String(experienceId)
  );

  await user.save();

  return NextResponse.json({
    success: true,
    message: `Experience ${experienceId} deleted.`,
  });
}