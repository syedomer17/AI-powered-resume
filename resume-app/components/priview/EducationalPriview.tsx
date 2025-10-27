"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const EducationalPriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  // Function to format date from YYYY-MM-DD to "Mon YYYY"
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div className="mb-3">
      {/* Section Title */}
      <h2 className="font-bold text-[12px] tracking-wider mb-1 uppercase text-black border-b border-black pb-0.5">
        Education
      </h2>

      {resumeInfo?.education?.length > 0 ? (
        resumeInfo.education.map((education, index) => (
          <div key={index} className="mt-2 mb-2.5">
            {/* Bullet + University and Dates */}
            <div className="flex justify-between items-baseline">
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px]">•</span>
                  <h3 className="text-[10px] font-bold text-black">
                    {education.universityName}
                  </h3>
                </div>
              </div>
              <span className="text-[9px] text-black italic text-right ml-3 whitespace-nowrap">
                {formatDate(education.startDate)} – {formatDate(education.endDate)}
              </span>
            </div>

            {/* Degree and Location on same line */}
            <div className="flex justify-between items-baseline">
              <div className="ml-3.5 text-[10px] text-black italic leading-[1.4]">
                {education.degree} in {education.major}
              </div>
              {(education.city || education.country) && (
                <div className="text-[10px] text-black text-right leading-[1.4]">
                  {education.city && education.country 
                    ? `${education.city}, ${education.country}`
                    : education.city || education.country
                  }
                </div>
              )}
            </div>

            {/* Relevant Coursework - Indented */}
            {education.description && (
              <div className="ml-3.5 text-[10px] text-black leading-[1.4] mt-0.5">
                <span className="font-bold">◦ Relevant Coursework:</span> {education.description}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-[10px] text-black mt-1">
          No education details available.
        </p>
      )}
    </div>
  );
};

export default EducationalPriview;
