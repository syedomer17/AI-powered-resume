import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string; resumeId: string } }
) {
  try {
    await connectToDB();

    const { userId, resumeId } = params;
    console.log(resumeId,userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    // Pull the resume with matching _id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { resumes: { _id: resumeId } } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Resume deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string; resumeId: string } }
) {
  try {
    await connectToDB();

    const { userId, resumeId } =await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).lean() as { resumes: any[] } | null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const resume = user.resumes.find(
      (r: any) => r._id.toString() === resumeId
    );

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, resume },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}