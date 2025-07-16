import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { ISkill, IResume } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, skills } = await req.json();

  if (!userId || !resumeId || !Array.isArray(skills)) {
    return NextResponse.json(
      { success: false, message: "Missing fields or invalid skills array" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );

  const resume = user.resumes.find((r: IResume) => r._id?.toString() === resumeId);
  if (!resume)
    return NextResponse.json(
      { success: false, message: "Resume not found" },
      { status: 404 }
    );

  // Map the skills with new ids and ensure category
  resume.skills = skills.map((item: ISkill, index: number) => ({
    id: index + 1,
    name: item.name,
    category: item.category || "General", // ensure fallback
  }));

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Skills updated",
    skills: resume.skills,
  });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, skillId } = await req.json();

  if (!userId || !resumeId || !skillId) {
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
  if (!resume.skills || resume.skills.length === 0) {
    return NextResponse.json(
      { success: false, message: "No skills found" },
      { status: 404 }
    );
  }

  resume.skills = resume.skills.filter(
    (skill:ISkill) => String(skill.id) !== String(skillId)
  );

  // Mark modified so Mongoose saves it
  user.markModified(`resumes.${resumeIndex}.skills`);

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Skill removed successfully",
    skills: resume.skills,
  });
}