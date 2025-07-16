"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const SkillsPriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  // Group skills by category
  const groupedSkills = resumeInfo?.skills?.reduce<Record<string, string[]>>(
    (acc, skill) => {
      const category = skill.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill.name);
      return acc;
    },
    {}
  );

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

      {/* If no skills */}
      {(!resumeInfo?.skills || resumeInfo.skills.length === 0) && (
        <p className="text-xs text-center text-muted-foreground">
          No skills added.
        </p>
      )}

      {/* Skills List */}
      <motion.div
        className="flex flex-col gap-2"
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
        {groupedSkills &&
          Object.entries(groupedSkills).map(([category, skills], index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col bg-zinc-50 dark:bg-zinc-800 p-3 rounded-md shadow-sm text-xs"
            >
              <span
                className="font-semibold mb-1"
                style={{ color: themeColor }}
              >
                {category}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {skills.join(", ")}
              </span>
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default SkillsPriview;
