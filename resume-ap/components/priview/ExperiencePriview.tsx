"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const ExperiencePriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  return (
    <div className="my-6">
      {/* Section Title */}
      <h2
        className="text-center font-bold text-sm tracking-wide mb-2"
        style={{ color: themeColor }}
      >
        Professional Experience
      </h2>
      <hr className="mb-6 border-t-2" style={{ borderColor: themeColor }} />

      {/* Experience Entries */}
      {resumeInfo?.experience?.length > 0 ? (
        resumeInfo.experience.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="mb-5 px-4 py-3 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            {/* Job Title */}
            <h3
              className="text-sm font-semibold mb-1"
              style={{ color: themeColor }}
            >
              {experience?.title}
            </h3>

            {/* Company and Date - responsive stack on mobile */}
            <div
              className="
                flex flex-col gap-1 
                sm:flex-row sm:justify-between sm:items-center 
                text-xs text-muted-foreground mb-1
              "
            >
              <span>
                {experience?.companyName}, {experience?.city}, {experience?.state}
              </span>
              <span>
                {experience?.startDate} –{" "}
                {experience?.currentlyWorking ? "Present" : experience?.endDate}
              </span>
            </div>

            {/* Summary (HTML content) */}
            {experience?.workSummery && (
              <div
                className="text-xs mt-2 text-zinc-700 dark:text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: experience.workSummery }}
              />
            )}
          </motion.div>
        ))
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          No experience details added.
        </p>
      )}
    </div>
  );
};

export default ExperiencePriview;
