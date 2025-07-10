import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PersonalDetails from "@/models/PersonalDetails.ts";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "Resume ID is required." }, { status: 400 });
  }

  await connectToDB();
  const found = await PersonalDetails.findById(id);
  if (!found) {
    return NextResponse.json({ message: "Resume not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    experience: found.experience || [],
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "Resume ID is required." }, { status: 400 });
  }

  const { experience } = await req.json();
  if (!experience || !Array.isArray(experience)) {
    return NextResponse.json({ message: "Experience array is required." }, { status: 400 });
  }

  await connectToDB();

  const updated = await PersonalDetails.findByIdAndUpdate(
    id,
    { experience },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ message: "Resume not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    experience: updated.experience,
  });
}
