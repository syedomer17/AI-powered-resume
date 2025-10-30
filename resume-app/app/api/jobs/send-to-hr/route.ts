import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { getAllHREmails, getTotalHRCount } from "@/data/hrEmails";
import { sendBulkEmails, generateJobApplicationEmail, EmailConfig } from "@/lib/emailConfig";

export const dynamic = 'force-dynamic';

interface SendToHRRequest {
  resumeId: string;
  jobTitle?: string;
  hrCount?: number; // Number of HRs to send to (default: all)
  resumePdfUrl?: string; // Optional uploaded resume URL
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body: SendToHRRequest = await req.json();
  const { resumeId, jobTitle = "Software Developer", hrCount, resumePdfUrl } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required." },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDB();

    // Find user and resume
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Find the specific resume
    const resume = user.resumes.find((r: any) => r._id.toString() === resumeId);

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found." },
        { status: 404 }
      );
    }

    // Get candidate name from resume
    const candidateName = `${resume.personalDetails?.firstName || ''} ${resume.personalDetails?.lastName || ''}`.trim() 
      || user.username 
      || session.user.name 
      || "Candidate";

    // Get HR emails
    const allHREmails = getAllHREmails();
    const targetEmails = hrCount 
      ? allHREmails.slice(0, hrCount) 
      : allHREmails;

    // Generate resume URL (you can customize this)
    // Prefer the uploaded PDF URL if provided; otherwise fall back to app view URL
    const resumeUrl = resumePdfUrl || (process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/resume/${resumeId}/view`
      : undefined);

    // Generate email HTML
    const emailHTML = generateJobApplicationEmail(
      candidateName,
      jobTitle,
      resumeUrl
    );

    // Prepare email configs
    const senderEmail = process.env.EMAIL_USER || "noreply@airesume.com";
    const emailConfigs: EmailConfig[] = targetEmails.map(hrEmail => ({
      from: `"${candidateName}" <${senderEmail}>`,
      to: hrEmail,
      subject: `Job Application - ${candidateName}`,
      html: emailHTML,
      // Note: In production, you would attach the actual PDF here
      // attachments: [{
      //   filename: `${candidateName}_Resume.pdf`,
      //   path: resumePdfPath,
      //   contentType: 'application/pdf'
      // }]
    }));

    // Send emails with progress tracking
    let currentProgress = 0;
    const results = await sendBulkEmails(
      emailConfigs,
      (current, total) => {
        currentProgress = current;
      }
    );

    return NextResponse.json({
      success: true,
      message: `Resume sent to ${results.sent} HR contacts`,
      data: {
        sent: results.sent,
        failed: results.failed,
        total: targetEmails.length,
        candidateName,
        jobTitle,
      },
    });
  } catch (error: any) {
    console.error("=== Send to HR Error ===");
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to send resume to HR.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check status and get HR count
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const totalHRCount = getTotalHRCount();

    return NextResponse.json({
      success: true,
      data: {
        totalHRContacts: totalHRCount,
        emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
        demoMode: !(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch HR status." },
      { status: 500 }
    );
  }
}
