"use client";

import { useResumeInfo } from "@/context/ResumeInfoConext";
import PersonalDetailPriview from "../priview/PersonalDetailPriview";
import Summery from "../priview/Summery";
import ExperiencePriview from "../priview/ExperiencePriview";
import EducationalPriview from "../priview/EducationalPriview";
import SkillsPriview from "../priview/SkillsPriview";
import ProjectPreview from "../priview/ProjectPreview";
import CertificationsPreview from "../priview/CertificationsPreview";
import { motion } from "framer-motion";

export default function ResumePriview() {
  const { resumeInfo } = useResumeInfo();

  return (
    <motion.div
      className="shadow-lg h-full px-12 py-8 bg-white rounded-md border border-gray-300"
      style={{ 
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        pageBreakInside: 'avoid'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-3" style={{ pageBreakInside: 'avoid' }}>
        <PersonalDetailPriview resumeInfo={resumeInfo} />
        <Summery resumeInfo={resumeInfo} />
        <ExperiencePriview resumeInfo={resumeInfo} />
        <ProjectPreview resumeInfo={resumeInfo} />
        <EducationalPriview resumeInfo={resumeInfo} />
        <SkillsPriview resumeInfo={resumeInfo} />
        <CertificationsPreview resumeInfo={resumeInfo} />
      </div>
    </motion.div>
  );
}
