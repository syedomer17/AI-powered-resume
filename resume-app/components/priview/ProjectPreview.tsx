"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

const ProjectPreview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2 tracking-wide"
        style={{ color: themeColor }}
      >
        Projects
      </h2>
      <hr style={{ borderColor: themeColor }} className="mb-4" />

      <AnimatePresence>
        {resumeInfo?.projects?.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="my-4 border-b pb-4 last:border-none"
          >
            {/* Title */}
            <h3
              className="text-sm font-bold mb-1 capitalize"
              style={{ color: themeColor }}
            >
              {project?.title}
            </h3>

            {/* Link and Dates */}
            <div
              className="
                flex flex-col gap-1
                sm:flex-row sm:justify-between sm:items-center
                text-xs mb-1
              "
            >
              {project?.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Project
                </a>
              ) : (
                <span />
              )}
              <span className="text-zinc-600 dark:text-zinc-400">
                {project?.startDate || ""} -{" "}
                {project?.currentlyWorking ? "Present" : project?.endDate || ""}
              </span>
            </div>

            {/* Description */}
            {project?.description && (
              <div
                className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: project.description,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPreview;
