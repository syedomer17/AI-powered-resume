"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import Header from "@/components/custom/Header";
import ResumePriview from "@/components/custom/ResumePriview";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
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

  const handleDownload = () => {
    const element = document.getElementById("print-area");

    if (!element) {
      console.error("Resume element not found for PDF generation.");
      return;
    }

    setDownloading(true);

    const safeFileName = resumeInfo?.firstName
      ? `${resumeInfo.firstName}-${resumeInfo.lastName}-Resume.pdf`
          .toLowerCase()
          .replace(/\s+/g, "-")
      : "resume.pdf";

    const opt = {
      margin: [10, 10, 10, 10], // top, right, bottom, left in mm
      filename: safeFileName,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        backgroundColor: "#ffffff",
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait",
        compress: true 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Clone the element to avoid affecting the displayed version
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Comprehensive color and style replacement
    const sanitizeForPDF = (elem: HTMLElement) => {
      // Get all elements including the root
      const allElements = [elem, ...Array.from(elem.querySelectorAll('*'))] as HTMLElement[];
      
      allElements.forEach((el) => {
        // Remove all class names that might trigger Tailwind/oklch styles
        el.removeAttribute('class');
        
        // Get computed styles before removing classes
        const styles = window.getComputedStyle(el);
        
        // Apply only essential inline styles with safe colors
        const tagName = el.tagName.toLowerCase();
        
        // Base styles for all elements
        el.style.fontFamily = 'Georgia, "Times New Roman", serif';
        el.style.boxSizing = 'border-box';
        
        // Copy essential layout properties
        if (styles.display) el.style.display = styles.display;
        if (styles.position && styles.position !== 'static') el.style.position = styles.position;
        if (styles.width && !styles.width.includes('auto')) el.style.width = styles.width;
        if (styles.height && !styles.height.includes('auto')) el.style.height = styles.height;
        if (styles.margin) el.style.margin = styles.margin;
        if (styles.padding) el.style.padding = styles.padding;
        if (styles.flexDirection) el.style.flexDirection = styles.flexDirection;
        if (styles.justifyContent) el.style.justifyContent = styles.justifyContent;
        if (styles.alignItems) el.style.alignItems = styles.alignItems;
        if (styles.gap) el.style.gap = styles.gap;
        if (styles.textAlign) el.style.textAlign = styles.textAlign;
        
        // Font properties
        if (styles.fontSize) el.style.fontSize = styles.fontSize;
        if (styles.fontWeight) el.style.fontWeight = styles.fontWeight;
        if (styles.fontStyle) el.style.fontStyle = styles.fontStyle;
        if (styles.lineHeight) el.style.lineHeight = styles.lineHeight;
        if (styles.letterSpacing) el.style.letterSpacing = styles.letterSpacing;
        if (styles.textTransform) el.style.textTransform = styles.textTransform;
        if (styles.textDecoration) el.style.textDecoration = styles.textDecoration;
        
        // Colors - force to safe values
        const color = styles.color;
        if (color && !color.includes('oklch')) {
          el.style.color = color;
        } else {
          el.style.color = '#000000'; // Black fallback
        }
        
        const bgColor = styles.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && !bgColor.includes('oklch')) {
          el.style.backgroundColor = bgColor;
        } else if (tagName === 'div' || elem === el) {
          el.style.backgroundColor = '#ffffff'; // White background
        }
        
        // Borders
        if (styles.borderTopWidth && styles.borderTopWidth !== '0px') {
          el.style.borderTop = `${styles.borderTopWidth} ${styles.borderTopStyle} #000000`;
        }
        if (styles.borderBottomWidth && styles.borderBottomWidth !== '0px') {
          el.style.borderBottom = `${styles.borderBottomWidth} ${styles.borderBottomStyle} #000000`;
        }
        if (styles.borderLeftWidth && styles.borderLeftWidth !== '0px') {
          el.style.borderLeft = `${styles.borderLeftWidth} ${styles.borderLeftStyle} #000000`;
        }
        if (styles.borderRightWidth && styles.borderRightWidth !== '0px') {
          el.style.borderRight = `${styles.borderRightWidth} ${styles.borderRightStyle} #000000`;
        }
        
        // Handle links specially
        if (tagName === 'a') {
          el.style.color = '#2563eb'; // Blue color for links
          el.style.textDecoration = 'underline';
        }
      });
    };
    
    // Apply print-specific styles
    clonedElement.style.width = "210mm"; // A4 width
    clonedElement.style.padding = "48px";
    clonedElement.style.backgroundColor = "#ffffff";
    clonedElement.style.color = "#000000";
    clonedElement.style.fontFamily = 'Georgia, "Times New Roman", serif';
    clonedElement.style.boxShadow = "none";
    clonedElement.style.border = "none";
    clonedElement.style.borderRadius = "0";
    
    // Sanitize all elements
    sanitizeForPDF(clonedElement);
    
    html2pdf()
      .set(opt)
      .from(clonedElement)
      .save()
      .then(() => {
        console.log("PDF generated successfully");
        setDownloading(false);
      })
      .catch((err: any) => {
        console.error("PDF generation failed:", err);
        setDownloading(false);
      });
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
