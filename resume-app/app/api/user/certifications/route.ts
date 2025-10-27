import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IResume, ICertification } from "@/models/User";

export async function PATCH(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, certifications } = await req.json();

  if (!userId || !resumeId || !certifications || !Array.isArray(certifications)) {
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
  const normalizedCertifications = certifications.map((cert: ICertification, idx: number) => ({
    ...cert,
    id: idx + 1,
  }));

  resume.certifications = normalizedCertifications;

  user.markModified(`resumes.${resumeIndex}.certifications`);
  await user.save();

  return NextResponse.json({
    success: true,
    message: "Certifications updated",
    certifications: resume.certifications,
  });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const { userId, resumeId, certificationId } = await req.json();

  if (!userId || !resumeId || !certificationId) {
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
  if (!resume.certifications || resume.certifications.length === 0) {
    return NextResponse.json(
      { success: false, message: "No certifications found" },
      { status: 404 }
    );
  }

  resume.certifications = resume.certifications.filter(
    (cert: ICertification) => String(cert.id) !== String(certificationId)
  );

  // Mark modified so Mongoose saves it
  user.markModified(`resumes.${resumeIndex}.certifications`);

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Certification removed successfully",
    certifications: resume.certifications,
  });
}
