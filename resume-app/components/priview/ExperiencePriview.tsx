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
    
    // Replace bullet points with ◦ and format bold labels
    let formatted = html
      .replace(/<li>/g, '<li style="margin-bottom: 0.25rem;">')
      .replace(/•/g, '◦')
      .replace(/<ul>/g, '<ul style="list-style: none; padding-left: 0; margin: 0;">')
      .replace(/<p>/g, '<p style="margin: 0;">');
    
    // Format patterns like "Label:" to be bold
    formatted = formatted.replace(
      /([A-Za-z\s&]+):/g,
      '<strong>$1:</strong>'
    );
    
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
                className="ml-3.5 text-[10px] text-black leading-[1.4] mt-0.5"
                style={{ textAlign: 'justify' }}
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
