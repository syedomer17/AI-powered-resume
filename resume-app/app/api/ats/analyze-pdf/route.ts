import { NextRequest, NextResponse } from "next/server";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { analyzeResumeTextATS } from "@/service/AIModel";
import { extractBasicsFromText } from "@/service/resumeParser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = (formData.get("jobDescription") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!jobDescription.trim()) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    // Ensure PDF
    const isPdf = file.type?.includes("pdf") || file.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const parsed = await pdfParse(buffer);
    const resumeText = (parsed.text || "").trim();

    if (!resumeText) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

  // Analyze with AI
  const ats = await analyzeResumeTextATS(resumeText, jobDescription);
  // Extract basic fields
  const basics = extractBasicsFromText(resumeText);

  return NextResponse.json({ success: true, data: ats, extracted: basics });
  } catch (err) {
    console.error("ATS analyze-pdf error:", err);
    return NextResponse.json({ error: "Failed to analyze PDF" }, { status: 500 });
  }
}
