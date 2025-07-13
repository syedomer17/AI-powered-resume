"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const SkillsPriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  return (
    <div className="my-6">
      {/* Section Title */}
      <h2
        className="text-center font-bold text-sm mb-2 tracking-wide"
        style={{ color: themeColor }}
      >
        Skills
      </h2>
      <hr style={{ borderColor: themeColor }} className="mb-4" />

      {/* Skills Grid with animation */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {resumeInfo?.skills.map((skill, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col gap-1 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-md shadow-sm"
          >
            <div className="flex justify-between items-center text-xs font-medium">
              <span>{skill.name}</span>
              <span>{skill.rating}/5</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded">
              <div
                className="h-2 rounded"
                style={{
                  background: themeColor,
                  width: `${skill.rating * 20}%`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillsPriview;
