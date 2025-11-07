"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import Header from "@/components/custom/Header";
import ResumePriview from "@/components/custom/ResumePriview";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import { useEffect, useState } from "react";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";
// Client-side PDF generation libs were causing visual mismatches.
// We'll prefer the server-rendered PDF via headless Chromium instead.
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { triggerConfetti } from "@/components/firecrackers/ConfettiSideCannons";

export default function ViewPage() {
  const params = useParams();
  const userId = params.userId;
  const resumeId = params.resumeIndex; // <- This is your _id
  const { callApi } = useApiWithRateLimit();

  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await callApi(`/api/user/${userId}/resume/${resumeId}`);

        if (!res) {
          setLoading(false);
          return;
        }

        const resume = res.resume;

        if (!resume) {
          console.warn("Resume not found");
          return;
        }

        const personal = resume.personalDetails?.[0] ?? {};

        const info: ResumeInfoType = {
          firstName: personal.firstName || "",
          lastName: personal.lastName || "",
          jobTitle: personal.jobTitle || "",
          address: personal.address || "",
          phone: personal.phone || "",
          email: personal.email || "",
          themeColor: personal.themeColor || "#ff6666",
          summery: resume.summary?.[0]?.text || "",
          country: personal.country || "",
          state: personal.state || "",
          city: personal.city || "",
          linkedIn: personal.linkedIn || "",
          linkedInUsername: personal.linkedInUsername || "",
          github: personal.github || "",
          githubUsername: personal.githubUsername || "",
          twitter: personal.twitter || "",
          twitterUsername: personal.twitterUsername || "",
          medium: personal.medium || "",
          mediumUsername: personal.mediumUsername || "",
          experience: resume.experience || [],
          education: resume.education || [],
          skills: resume.skills || [],
          projects: resume.projects || [],
          certifications: resume.certifications || [],
          hasPersonalDetails: !!resume.personalDetails?.length,
        };

        setResumeInfo(info);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        setResumeInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [userId, resumeId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Ask the server to render the resume URL to a real PDF (preserves layout and links)
      const res = await fetch(
        `/api/generate-pdf?userId=${userId}&resumeId=${resumeId}`
      );
      if (!res.ok) throw new Error(`PDF API failed: ${res.status}`);
      const blob = await res.blob();

      // Build filename
      const safeFileName = resumeInfo?.firstName
        ? `${resumeInfo.firstName}-${resumeInfo.lastName}-Resume.pdf`
            .toLowerCase()
            .replace(/\s+/g, "-")
        : "resume.pdf";

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Trigger confetti celebration on successful download
      triggerConfetti();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <Loader2 className="animate-spin w-12 h-12 text-primary" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          Loading your resume...
        </p>
      </div>
    );
  }

  if (!resumeInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Resume not found
          </h2>
          <p className="text-muted-foreground">
            The requested resume could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResumeInfoProvider defaultValue={resumeInfo}>
      <div id="no-print" className="min-h-screen bg-background">
        <Header />
        <AnimatePresence>
          <motion.div
            className="container max-w-5xl px-4 md:px-6 lg:px-8 mx-auto py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="text-center mb-8 space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-block"
              >
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  🎉 Your Resume is Ready!
                </h2>
              </motion.div>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Download or share your professionally crafted resume with
                potential employers.
              </p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
                className="
    relative overflow-hidden
    rounded-xl px-6 py-3 font-semibold 
    flex items-center gap-2
    text-white dark:text-black
    shadow-lg hover:shadow-2xl
    transition-all duration-300
    bg-gradient-to-r from-blue-600 to-purple-600
    dark:from-blue-300 dark:to-purple-400
    hover:opacity-90 hover:-translate-y-[2px]
    backdrop-blur-md
  "
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download PDF
                  </>
                )}
              </Button>

              <RWebShare
                data={{
                  text: "Checkout my resume!",
                  url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/resume/${userId}/${resumeId}/view`,
                  title: "Flamingos Resume",
                }}
              >
                <Button
                  size="lg"
                  className="btn-share-invert px-6 py-3 font-semibold flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-[2px]"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </Button>
              </RWebShare>
            </motion.div>

            {/* Mobile Scroll Hint */}
            <motion.div
              className="md:hidden text-center mb-3 text-sm text-muted-foreground flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>Swipe to view full resume</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.div>

            {/* Resume Preview Card */}
            <motion.div
              id="print-area"
              className="relative bg-card rounded-xl shadow-lg border border-border p-4 md:p-6 overflow-x-auto md:overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Resume Content */}
              <div className="relative min-w-[595px] md:min-w-0">
                <ResumePriview />
              </div>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              className="text-center mt-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <p>
                💡 Tip: The downloaded PDF will maintain all formatting and
                links
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ResumeInfoProvider>
  );
}
