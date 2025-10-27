"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion, AnimatePresence } from "framer-motion";

const ProjectPreview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  // Format project details to have nested bullets
  const formatProjectDetails = (description: string) => {
    if (!description) return "";
    
    // Split by newlines or HTML breaks
    const lines = description
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p><p>/gi, '\n')
      .replace(/<\/?p>/gi, '')
      .split('\n')
      .filter(line => line.trim());
    
    return lines
      .map(line => {
        const trimmed = line.trim();
        // If it already starts with ◦ or •, keep it
        if (trimmed.startsWith('◦') || trimmed.startsWith('•')) {
          return trimmed;
        }
        // Otherwise add the nested bullet
        return `◦ ${trimmed}`;
      })
      .join('\n');
  };

  return (
    <div className="mb-3">
      <h2 
        className="font-bold text-[12px] tracking-wider mb-1.5 uppercase text-black border-b border-black pb-0.5"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Projects
      </h2>

      <AnimatePresence>
        {resumeInfo?.projects?.map((project, index) => (
          <div key={index} className="mb-2.5">
            {/* Bullet + Project Title and View Project Link */}
            <div className="flex justify-between items-baseline">
              <div className="flex items-baseline gap-1.5">
                <span 
                  className="text-[10px] leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  •
                </span>
                <h3 
                  className="text-[10px] font-bold text-black leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {project?.title}
                </h3>
              </div>
              {project?.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-blue-600 hover:underline leading-[1.4]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  View Project
                </a>
              )}
            </div>

            {/* Tech Stack - Indented, Italic */}
            {project?.techStack && (
              <div 
                className="ml-3.5 text-[10px] text-black italic leading-[1.4] mt-0.5"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {project.techStack}
              </div>
            )}

            {/* Project Details - Indented with nested bullets */}
            {project?.description && (
              <div 
                className="ml-3.5 text-[10px] text-black leading-[1.4] mt-0.5"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {formatProjectDetails(project.description).split('\n').map((line, i) => {
                  // Check if line has bold labels like "Personalization:" or "Security:"
                  const match = line.match(/^(◦\s*)([^:]+)(:)/);
                  if (match) {
                    return (
                      <div key={i} className="flex items-start gap-1">
                        <span>{match[1]}</span>
                        <span>
                          <span className="font-bold">{match[2]}:</span>
                          {line.substring(match[0].length)}
                        </span>
                      </div>
                    );
                  }
                  return <div key={i}>{line}</div>;
                })}
              </div>
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPreview;
