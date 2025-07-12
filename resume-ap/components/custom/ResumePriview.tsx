"use client";

import { useResumeInfo } from "@/context/ResumeInfoConext";
import PersonalDetailPriview from "../priview/PersonalDetailPriview";
import Summery from "../priview/Summery";
import ExperiencePriview from "../priview/ExperiencePriview";
import EducationalPriview from "../priview/EducationalPriview";
import SkillsPriview from "../priview/SkillsPriview";
import ProjectPreview from "../priview/ProjectPreview";

export default function ResumePriview() {
  const { resumeInfo } = useResumeInfo();

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px]"
      style={{ borderColor: resumeInfo?.themeColor || "#000" }}
    >
      <PersonalDetailPriview resumeInfo={resumeInfo} />
      <Summery resumeInfo={resumeInfo} />
      <ExperiencePriview resumeInfo={resumeInfo} />
      <ProjectPreview resumeInfo={resumeInfo} /> {/* ✅ add here */}
      <EducationalPriview resumeInfo={resumeInfo} />
      <SkillsPriview resumeInfo={resumeInfo} />
    </div>
  );
}
