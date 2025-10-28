"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import Header from "@/components/custom/Header";
import ResumePriview from "@/components/custom/ResumePriview";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ViewPage() {
  const params = useParams();
  const userId = params.userId;
  const resumeId = params.resumeIndex; // <- This is your _id

  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}/resume/${resumeId}`);
        const resume = res.data.resume;

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
    const element = document.getElementById("print-area");

    if (!element) {
      console.error("Resume element not found for PDF generation.");
      return;
    }

    setDownloading(true);

    try {
      // Generate canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      let position = 0;

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF (handle multiple pages if needed)
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const safeFileName = resumeInfo?.firstName
        ? `${resumeInfo.firstName}-${resumeInfo.lastName}-Resume.pdf`
            .toLowerCase()
            .replace(/\s+/g, "-")
        : "resume.pdf";

      // Save PDF
      pdf.save(safeFileName);

      console.log("PDF generated successfully");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (!resumeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Resume not found.
      </div>
    );
  }

  return (
    <ResumeInfoProvider defaultValue={resumeInfo}>
      <div id="no-print">
        <Header />
        <AnimatePresence>
          <motion.div
            className="container max-w-4xl px-4 md:px-6 lg:px-8 mx-auto my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center text-2xl font-semibold mb-2">
              🎉 Your Resume is Ready!
            </h2>
            <p className="text-center text-gray-500">
              Download or share your professionally crafted resume.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 my-6">
              <Button onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  "Download as PDF"
                )}
              </Button>
              <RWebShare
                data={{
                  text: "Hello Everyone, This is my Resume",
                  url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/resume/${userId}/${resumeId}/view`,
                  title: "Flamingos Resume",
                }}
                onClick={() => console.log("Shared successfully!")}
              >
                <Button variant="outline">Share</Button>
              </RWebShare>
            </div>

            <motion.div
              id="print-area"
              className="bg-white rounded-lg shadow-lg border border-zinc-200 p-4 md:p-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResumePriview />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ResumeInfoProvider>
  );
}
