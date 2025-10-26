import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

interface AutoApplyRequest {
  jobIds: string[]; // Array of job IDs to apply to
  resumeId: string;
}

interface JobApplication {
  jobId: string;
  status: 'success' | 'failed';
  message: string;
  appliedAt: string;
}

// Mock auto-apply function
const mockAutoApply = async (jobId: string, resumeId: string): Promise<JobApplication> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  // Simulate 90% success rate
  const success = Math.random() > 0.1;

  return {
    jobId,
    status: success ? 'success' : 'failed',
    message: success 
      ? 'Application submitted successfully' 
      : 'Failed to submit application - try again later',
    appliedAt: new Date().toISOString(),
  };
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body: AutoApplyRequest = await req.json();
    const { jobIds, resumeId } = body;

    if (!jobIds || jobIds.length === 0) {
      return NextResponse.json(
        { error: "Job IDs are required." },
        { status: 400 }
      );
    }

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required." },
        { status: 400 }
      );
    }

    console.log("=== Auto Apply Request ===");
    console.log("User:", session.user.email);
    console.log("Resume ID:", resumeId);
    console.log("Number of jobs:", jobIds.length);

    const results: JobApplication[] = [];
    let successCount = 0;
    let failedCount = 0;

    // Process each job application
    for (const jobId of jobIds) {
      console.log(`Applying to job: ${jobId}...`);
      
      const result = await mockAutoApply(jobId, resumeId);
      results.push(result);

      if (result.status === 'success') {
        successCount++;
      } else {
        failedCount++;
      }

      // Log progress
      console.log(`Progress: ${results.length}/${jobIds.length} - ${result.status}`);
    }

    console.log("=== Auto Apply Results ===");
    console.log(`Successfully applied: ${successCount}`);
    console.log(`Failed: ${failedCount}`);

    return NextResponse.json({
      success: true,
      message: `Applied to ${successCount} out of ${jobIds.length} jobs`,
      data: {
        total: jobIds.length,
        successful: successCount,
        failed: failedCount,
        results,
      },
    });
  } catch (error: any) {
    console.error("=== Auto Apply Error ===");
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to process auto-apply.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check auto-apply status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // In a real application, you would fetch actual application history from database
    return NextResponse.json({
      success: true,
      data: {
        autoApplyEnabled: true,
        message: "Auto-apply is a mock feature for demonstration purposes",
        note: "In production, this would integrate with actual job application APIs (LinkedIn Easy Apply, Indeed Quick Apply, etc.)",
      },
    });
  } catch (error: any) {
    console.error("Error fetching auto-apply status:", error);
    return NextResponse.json(
      { error: "Failed to fetch auto-apply status." },
      { status: 500 }
    );
  }
}
