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
      id="resume-preview"
      className="h-full bg-white dark:bg-white mx-auto overflow-x-auto rounded-lg"
      style={{ 
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        pageBreakInside: 'avoid',
        padding: '48px',
        minWidth: '800px',
        width: '800px',
        maxWidth: '800px',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <style jsx global>{`
        @media print {
          #resume-preview {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
        }
        
        /* Force white background for resume preview in dark mode */
        #resume-preview {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        
        #resume-preview * {
          color: inherit !important;
        }
        
        /* Allow links to have their own colors */
        #resume-preview a,
        #resume-preview a *,
        #resume-preview .text-blue-600,
        #resume-preview .text-blue-700 {
          color: #1d4ed8 !important;
        }
      `}</style>
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