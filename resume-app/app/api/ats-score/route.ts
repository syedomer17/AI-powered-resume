import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, resumeId, atsData } = body;

    if (!userId || !resumeId || !atsData) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Find the resume by _id
    const resume = user.resumes.find(
      (r: any) => r._id.toString() === resumeId
    );

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found." },
        { status: 404 }
      );
    }

    // Update ATS analysis
    resume.atsAnalysis = {
      score: atsData.score,
      matchPercentage: atsData.matchPercentage,
      jobDescription: atsData.jobDescription,
      analyzedAt: new Date(),
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: "ATS score saved successfully.",
    });
  } catch (err) {
    console.error("Error saving ATS score:", err);
    return NextResponse.json(
      { error: "Failed to save ATS score." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const resumeId = searchParams.get("resumeId");

    if (!userId || !resumeId) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const resume = user.resumes.find(
      (r: any) => r._id.toString() === resumeId
    );

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resume.atsAnalysis || null,
    });
  } catch (err) {
    console.error("Error fetching ATS score:", err);
    return NextResponse.json(
      { error: "Failed to fetch ATS score." },
      { status: 500 }
    );
  }
}
