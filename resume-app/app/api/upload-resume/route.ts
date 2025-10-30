import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Only allow PDF files
    if (!(file.type?.includes("pdf") || file.name?.toLowerCase().endsWith(".pdf"))) {
      return NextResponse.json({ success: false, message: "Please upload a PDF file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "resumes",
          resource_type: "raw", // ensure PDFs are accepted
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url: (result as any).secure_url });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json({ success: false, message: "Failed to upload resume" }, { status: 500 });
  }
}
