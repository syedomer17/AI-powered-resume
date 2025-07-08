import { connectToDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id: resumeId } = context.params;

  if (!resumeId) {
    return NextResponse.json(
      { success: false, message: "Resume ID is required" },
      { status: 400 }
    );
  }

  const { experience } = await request.json();

  if (!experience) {
    return NextResponse.json(
      { success: false, message: "Experience is required" },
      { status: 400 }
    );
  }

  await connectToDB();

  const updatedResume = await Resume.findByIdAndUpdate(
    resumeId,
    { experience },
    { new: true }
  );

  if (!updatedResume) {
    return NextResponse.json(
      { success: false, message: "Resume not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, experience: updatedResume.experience });
}