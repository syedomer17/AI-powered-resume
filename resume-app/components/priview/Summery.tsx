"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion } from "framer-motion";

const Summary = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  return (
    <div className="mb-4">
      {/* Section Heading with underline */}
      <h2 className="font-bold text-[12px] tracking-[0.15em] mb-2 uppercase text-black border-b-[1.5px] border-black pb-1">
        Professional Summary
      </h2>

      {/* Summary Content with bullet point */}
      <div className="text-[11px] text-black leading-[1.5] text-justify">
        <div className="flex items-start gap-2">
          <span className="mt-1">◦</span>
          <p className="flex-1">
            {resumeInfo?.summery?.trim() || "A software developer with expertise in full-stack web development and cloud deployment. Proven ability to build industry-grade applications using technologies like Next.js, Node.js, and MongoDB. Hands-on experience with AWS services including EC2, EFS, Load Balancer, and SNS, as well as configuring Ubuntu virtual machines and writing Bash scripts for server management. Improved code efficiency by 25% and increased user test engagement by 40%. Seeking to contribute development skills to an innovative engineering team."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
