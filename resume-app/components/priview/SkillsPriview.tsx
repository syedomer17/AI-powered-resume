"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const SkillsPriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  // Group skills by category
  const groupedSkills = resumeInfo?.skills?.reduce<Record<string, string[]>>(
    (acc, skill) => {
      const category = skill.category || "Programming Languages";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill.name);
      return acc;
    },
    {}
  );

  return (
    <div className="mb-3">
      {/* Section Title */}
      <h2 
        className="font-bold text-[12px] tracking-wider mb-1.5 uppercase text-black border-b border-black pb-0.5"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Technical Skills
      </h2>

      {/* If no skills */}
      {(!resumeInfo?.skills || resumeInfo.skills.length === 0) && (
        <p 
          className="text-[10px] text-black mt-1 leading-[1.4]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          No skills added.
        </p>
      )}

      {/* Skills List with Bullets */}
      <div className="mt-0.5">
        {groupedSkills &&
          Object.entries(groupedSkills).map(([category, skills], index) => (
            <div key={index} className="mb-0.5">
              <div className="flex items-start gap-1.5">
                <span 
                  className="text-[10px] leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  •
                </span>
                <div 
                  className="flex-1 text-[10px] text-black leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  <span className="font-bold">{category}:</span> {skills.join(", ")}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SkillsPriview;
