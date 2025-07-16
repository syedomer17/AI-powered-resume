"use client";

import { useResumeInfo } from "@/context/ResumeInfoConext";
import PersonalDetailPriview from "../priview/PersonalDetailPriview";
import Summery from "../priview/Summery";
import ExperiencePriview from "../priview/ExperiencePriview";
import EducationalPriview from "../priview/EducationalPriview";
import SkillsPriview from "../priview/SkillsPriview";
import ProjectPreview from "../priview/ProjectPreview";
import { motion } from "framer-motion";

export default function ResumePriview() {
  const { resumeInfo } = useResumeInfo();

  return (
    <motion.div
      className="shadow-lg h-full p-8 sm:p-14 border-t-[20px] bg-white rounded-md"
      style={{ borderColor: resumeInfo?.themeColor || "#000" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6">
        <PersonalDetailPriview resumeInfo={resumeInfo} />
        <Summery resumeInfo={resumeInfo} />
        <ExperiencePriview resumeInfo={resumeInfo} />
        <ProjectPreview resumeInfo={resumeInfo} />
        <EducationalPriview resumeInfo={resumeInfo} />
        <SkillsPriview resumeInfo={resumeInfo} />
      </div>
    </motion.div>
  );
}
