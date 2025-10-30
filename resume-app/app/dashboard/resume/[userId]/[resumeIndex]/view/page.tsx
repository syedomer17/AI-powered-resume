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
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = element.offsetWidth + "px";
      document.body.appendChild(tempContainer);
      tempContainer.appendChild(clonedElement);

      // Function to copy computed styles and sanitize colors
      const copyAndSanitizeStyles = (sourceEl: Element, targetEl: HTMLElement) => {
        const computed = window.getComputedStyle(sourceEl as HTMLElement);
        
        // Copy all important layout and visual styles
        const stylesToCopy = [
          'display', 'position', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
          'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
          'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
          'fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
          'textAlign', 'textDecoration', 'textTransform', 'whiteSpace',
          'borderWidth', 'borderStyle', 'borderRadius',
          'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'gap', 'flex', 'flexGrow', 'flexShrink',
          'gridTemplateColumns', 'gridTemplateRows', 'gridGap',
          'boxSizing', 'overflow', 'overflowX', 'overflowY',
          'opacity', 'visibility', 'zIndex'
        ];
        
        stylesToCopy.forEach(prop => {
          const value = computed.getPropertyValue(prop);
          if (value && value !== 'normal' && value !== 'none' && value !== 'auto') {
            (targetEl.style as any)[prop] = value;
          }
        });
        
        // Special handling for links - always make them blue
        if (targetEl.tagName.toLowerCase() === 'a') {
          targetEl.style.color = '#2563eb';
          targetEl.style.textDecoration = 'underline';
          return; // Skip normal color handling for links
        }
        
        // Handle colors - convert oklch to safe values
        let color = computed.color;
        if (color.includes('oklch')) {
          targetEl.style.color = '#000000';
        } else if (color && color !== 'rgba(0, 0, 0, 0)') {
          targetEl.style.color = color;
        }
        
        let bgColor = computed.backgroundColor;
        if (bgColor.includes('oklch')) {
          // Keep transparent backgrounds, only set white for main container
          if (targetEl.id === 'print-area' || targetEl.tagName.toLowerCase() === 'body') {
            targetEl.style.backgroundColor = '#ffffff';
          }
        } else if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          targetEl.style.backgroundColor = bgColor;
        }
        
        // Handle border colors
        ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(prop => {
          let borderColor = computed.getPropertyValue(prop);
          if (borderColor && borderColor.includes('oklch')) {
            (targetEl.style as any)[prop] = '#000000';
          } else if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
            (targetEl.style as any)[prop] = borderColor;
          }
        });
      };

      // Recursively copy styles from original to cloned element
      const processElement = (originalEl: Element, clonedEl: Element) => {
        if (clonedEl instanceof HTMLElement) {
          copyAndSanitizeStyles(originalEl, clonedEl);
        }
        
        // Process children
        const originalChildren = Array.from(originalEl.children);
        const clonedChildren = Array.from(clonedEl.children);
        
        originalChildren.forEach((origChild, index) => {
          if (clonedChildren[index]) {
            processElement(origChild, clonedChildren[index]);
          }
        });
      };

      // Process all elements
      processElement(element, clonedElement);

      // Wait a bit for styles to be applied
      await new Promise(resolve => setTimeout(resolve, 100));

      // Ensure all links are blue and properly styled
      const allLinks = clonedElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
      allLinks.forEach((link) => {
        link.style.color = '#2563eb'; // Blue color for all links
        link.style.textDecoration = 'underline';
        link.style.fontWeight = 'normal';
      });

      // Generate canvas from HTML element
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Final pass: sanitize any remaining oklch colors in the cloned document
          const allElements = clonedDoc.querySelectorAll('*') as NodeListOf<HTMLElement>;
          allElements.forEach((el) => {
            const computed = clonedDoc.defaultView?.getComputedStyle(el);
            if (!computed) return;
            
            // Ensure links are blue
            if (el.tagName.toLowerCase() === 'a') {
              el.style.setProperty('color', '#2563eb', 'important');
              el.style.setProperty('text-decoration', 'underline', 'important');
            }
            
            // Check and fix color
            if (computed.color.includes('oklch')) {
              el.style.setProperty('color', '#000000', 'important');
            }
            
            // Check and fix background color
            if (computed.backgroundColor.includes('oklch')) {
              if (el.id === 'print-area') {
                el.style.setProperty('background-color', '#ffffff', 'important');
              } else {
                el.style.setProperty('background-color', 'transparent', 'important');
              }
            }
            
            // Check and fix border colors
            ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'].forEach(prop => {
              const value = computed.getPropertyValue(prop);
              if (value && value.includes('oklch')) {
                el.style.setProperty(prop, '#000000', 'important');
              }
            });
          });
        }
      });

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      // Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF with clickable links
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
      
      // Add clickable link annotations
      const links = element.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
      links.forEach((link) => {
        const rect = link.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Calculate relative position
        const x = ((rect.left - elementRect.left) / element.offsetWidth) * imgWidth;
        const y = ((rect.top - elementRect.top) / element.offsetHeight) * imgHeight;
        const width = (rect.width / element.offsetWidth) * imgWidth;
        const height = (rect.height / element.offsetHeight) * imgHeight;
        
        // Add link annotation to PDF
        if (link.href) {
          pdf.link(x, y, width, height, { url: link.href });
        }
      });
      
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
