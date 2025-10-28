"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const ExperiencePriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  // Function to format date from YYYY-MM-DD to "Mon YYYY"
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Function to parse and format work summary with bold labels
  const formatWorkSummary = (html: string) => {
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
      {/* Section Title */}
      <h2 className="font-bold text-[12px] tracking-wider mb-1 uppercase text-black border-b border-black pb-0.5">
        Experience
      </h2>

      {/* Experience Entries */}
      {resumeInfo?.experience?.length > 0 ? (
        resumeInfo.experience.map((experience, index) => (
          <div key={index} className="mt-2 mb-2.5">
            {/* Bullet + Job Title and Dates on same line */}
            <div className="flex justify-between items-baseline">
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px]">•</span>
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-black inline">
                      {experience?.title}
                    </h3>
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-black italic text-right ml-3 whitespace-nowrap">
                {formatDate(experience?.startDate)} – {experience?.currentlyWorking ? "Present" : formatDate(experience?.endDate)}
              </span>
            </div>

            {/* Company Name and Work Type - Indented on left, Work Type on right */}
            <div className="flex justify-between items-baseline">
              <div className="ml-3.5 text-[10px] text-black italic leading-[1.4]">
                {experience?.companyName}
              </div>
              {experience?.workType && (
                <div className="text-[10px] text-black text-right leading-[1.4]">
                  {experience.workType}
                </div>
              )}
            </div>

            {/* Work Summary with ◦ bullets - Indented */}
            {experience?.workSummery && (
              <div
                className="ml-3.5 text-[10px] text-black leading-[1.4] mt-0.5 prose prose-sm max-w-none"
                style={{ 
                  textAlign: 'justify',
                  fontFamily: 'Georgia, "Times New Roman", serif'
                }}
                dangerouslySetInnerHTML={{ __html: formatWorkSummary(experience.workSummery) }}
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-[10px] text-black mt-1">
          No experience details added.
        </p>
      )}
    </div>
  );
};

export default ExperiencePriview;
