"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion, AnimatePresence } from "framer-motion";

const ProjectPreview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  // Function to format project description HTML with inline styles
  const formatProjectDetails = (html: string) => {
    if (!html) return "";
    
    // Decode HTML entities if they exist (in case it's double-encoded)
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    let decoded = textarea.value;
    
    // Style the HTML elements with inline styles
    let formatted = decoded
      // Style list items
      .replace(/<li>/g, '<li style="margin-bottom: 0.25rem;">')
      // Style unordered lists  
      .replace(/<ul>/g, '<ul style="list-style: disc !important; padding-left: 1.25rem !important; margin: 0.5rem 0;">')
      // Style ordered lists
      .replace(/<ol>/g, '<ol style="list-style: decimal !important; padding-left: 1.25rem !important; margin: 0.5rem 0;">')
      // Remove paragraph margins
      .replace(/<p>/g, '<p style="margin: 0.25rem 0;">')
      // Style headings if any
      .replace(/<h1>/g, '<h1 style="font-size: 10px; font-weight: bold; margin: 0.25rem 0;">')
      .replace(/<h2>/g, '<h2 style="font-size: 10px; font-weight: bold; margin: 0.25rem 0;">')
      .replace(/<h3>/g, '<h3 style="font-size: 10px; font-weight: bold; margin: 0.25rem 0;">')
      // Ensure strong tags have bold weight
      .replace(/<strong>/g, '<strong style="font-weight: 700 !important;">')
      // Ensure em/italic tags
      .replace(/<em>/g, '<em style="font-style: italic !important;">')
      // Ensure underline
      .replace(/<u>/g, '<u style="text-decoration: underline !important;">')
      // Ensure strikethrough
      .replace(/<s>/g, '<s style="text-decoration: line-through !important;">');
    
    return formatted;
  };

  return (
    <div className="mb-3">
      <h2 
        className="font-bold text-[12px] tracking-wider mb-1.5 uppercase text-black border-b border-black pb-0.5"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Projects
      </h2>

      <AnimatePresence>
        {resumeInfo?.projects?.map((project, index) => (
          <div key={index} className="mb-2.5">
            {/* Bullet + Project Title and View Project Link */}
            <div className="flex justify-between items-baseline">
              <div className="flex items-baseline gap-1.5">
                <span 
                  className="text-[10px] leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  •
                </span>
                <h3 
                  className="text-[10px] font-bold text-black leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {project?.title}
                </h3>
              </div>
              {project?.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-blue-600 hover:underline leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  View Project
                </a>
              )}
            </div>

            {/* Tech Stack - Indented, Italic */}
            {project?.techStack && (
              <div 
                className="ml-3.5 text-[10px] text-black italic leading-[1.4] mt-0.5"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {project.techStack}
              </div>
            )}

            {/* Project Details - Indented with HTML rendering */}
            {project?.description && (
              <div 
                className="ml-3.5 text-[10px] text-black leading-[1.4] mt-0.5 prose prose-sm max-w-none"
                style={{ 
                  textAlign: 'justify',
                  fontFamily: 'Georgia, "Times New Roman", serif'
                }}
                dangerouslySetInnerHTML={{ __html: formatProjectDetails(project.description) }}
              />
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPreview;
