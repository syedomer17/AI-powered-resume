"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const Summary = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  return (
    <motion.div
      className="my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Heading */}
      <h2
        className="text-center font-bold text-sm tracking-wide mb-2"
        style={{ color: themeColor }}
      >
        Summary
      </h2>
      <hr className="mb-4 border-t-2" style={{ borderColor: themeColor }} />

      {/* Summary Content */}
      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
        {resumeInfo?.summery?.trim() || "No summary provided."}
      </p>
    </motion.div>
  );
};

export default Summary;
