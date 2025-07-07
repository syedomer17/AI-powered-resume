"use client";

import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoConext";
import PersonalDetailPriview from "../priview/PersonalDetailPriview";
import Summery from "../priview/Summery";
import ExperiencePriview from "../priview/ExperiencePriview";
import EducationalPriview from "../priview/EducationalPriview";
import SkillsPriview from "../priview/SkillsPriview";

export default function ResumePriview() {
  const context = useContext(ResumeInfoContext);
  if (!context) return null;

  const { resumeInfo,setResumeInfo } = context;

  return (
    <div className="shadow-lg h-full p-14 border-t-[20px]" style={{borderColor:resumeInfo?.themeColor}}>
      <PersonalDetailPriview resumeInfo={resumeInfo} />
      {/* More sections */}
      <Summery resumeInfo={resumeInfo}/>

      <ExperiencePriview resumeInfo={resumeInfo}/>

      <EducationalPriview resumeInfo={resumeInfo}/>
      <SkillsPriview resumeInfo={resumeInfo}/>
    </div>
  );
}
