"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";

const ProjectPreview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Projects
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />
      {resumeInfo?.projects?.map((project, index) => (
        <div key={index} className="my-5">
          <h3
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {project?.title}
          </h3>
          <h2 className="text-xs flex justify-between items-center">
            {project?.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                View Project
              </a>
            ) : (
              <span>&nbsp;</span>
            )}
            <span>
              {project?.startDate || ""} -{" "}
              {project?.currentlyWorking ? "Present" : project?.endDate || ""}
            </span>
          </h2>
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{
              __html: project?.description || "",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectPreview;
