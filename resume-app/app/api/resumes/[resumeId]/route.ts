import { NextResponse, type NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { IResume } from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    await connectToDB();

    const params = await context.params;
    const resumeId = params.resumeId;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      "resumes._id": new mongoose.Types.ObjectId(resumeId),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User or resume not found" },
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

    return NextResponse.json(
      { success: true, resume },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
