import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";

const ExperiencePriview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />
      {resumeInfo?.experience.map((experience, index) => {
        return (
          <div key={index} className="my-5">
            <h3
              className="text-sm font-bold"
              style={{ color: resumeInfo?.themeColor }}
            >
              {experience?.title}
            </h3>
            <h2 className="text-xs flex justify-between">
              {experience?.companyName}, {experience?.city}, {experience?.state}
              <span>
                {experience?.startDate}{" "}
                {experience?.currentlyWorking ? "Persent" : experience?.endDate}
              </span>
            </h2>
            <p className="text-xs my-2">{experience.workSummery}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ExperiencePriview;
