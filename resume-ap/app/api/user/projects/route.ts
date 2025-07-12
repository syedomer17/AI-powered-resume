import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IResume, IProject } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();

  const { userId, resumeId, project } = await req.json();

  if (!userId || !resumeId || !project) {
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

  // Find resume index first for marking modified
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

  if (!resume.projects) {
    resume.projects = [];
  }

  const existingProjectIndex = resume.projects.findIndex(
    (p: IProject) => p.id === project.id
  );

  if (existingProjectIndex !== -1) {
    // Update existing project
    resume.projects[existingProjectIndex] = project;
  } else {
    // Add new project
    resume.projects.push(project);
  }

  // Mark the specific path modified
  user.markModified(`resumes.${resumeIndex}.projects`);

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Project added or updated successfully",
    projects: resume.projects,
  });
}
