import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeATS } from "@/service/AIModel";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData, jobDescription } = body;

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required." },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    // Analyze the resume
    const atsAnalysis = await analyzeResumeATS(resumeData, jobDescription);

    return NextResponse.json({
      success: true,
      data: atsAnalysis,
    });
  } catch (err: any) {
    console.error("ATS analysis error:", err);
    
    // Check if it's a 503 overload error
    if (err?.status === 503 || err?.message?.includes("overloaded")) {
      return NextResponse.json(
        { error: "AI service is currently busy. Please try again in a few moments." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
