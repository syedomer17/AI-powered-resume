import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IResume, IProject } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, projects } = await req.json();

  if (!userId || !resumeId || !projects || !Array.isArray(projects)) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );

  const resumeIndex = user.resumes.findIndex(
    (r: IResume) => r._id?.toString() === resumeId
  );
  if (resumeIndex === -1)
    return NextResponse.json(
      { success: false, message: "Resume not found" },
      { status: 404 }
    );

  const resume = user.resumes[resumeIndex];

  // Reassign IDs so they are always 1, 2, 3...
  const normalizedProjects = projects.map((proj: IProject, idx: number) => ({
    ...proj,
    id: idx + 1,
  }));

  resume.projects = normalizedProjects;

  user.markModified(`resumes.${resumeIndex}.projects`);
  await user.save();

  return NextResponse.json({
    success: true,
    message: "Projects updated successfully",
    projects: resume.projects,
  });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, projectId } = await req.json();

  if (!userId || !resumeId || !projectId) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );

  const resumeIndex = user.resumes.findIndex(
    (r: IResume) => r._id?.toString() === resumeId
  );
  if (resumeIndex === -1)
    return NextResponse.json(
      { success: false, message: "Resume not found" },
      { status: 404 }
    );

  const resume = user.resumes[resumeIndex];
  const initialLength = resume.projects.length;

  resume.projects = resume.projects.filter(
    (p: IProject) => String(p.id) !== String(projectId)
  );

  if (resume.projects.length === initialLength) {
    return NextResponse.json(
      { success: false, message: "Project not found" },
      { status: 404 }
    );
  }

  // Reassign IDs again after deletion
  resume.projects = resume.projects.map((proj: IProject, idx: number) => ({
    ...proj,
    id: idx + 1,
  }));

  user.markModified(`resumes.${resumeIndex}.projects`);
  await user.save();

  return NextResponse.json({
    success: true,
    message: "Project removed",
    projects: resume.projects,
  });
}
