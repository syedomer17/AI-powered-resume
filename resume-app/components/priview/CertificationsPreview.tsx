"use client";

import React from "react";
import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { motion, AnimatePresence } from "framer-motion";

const CertificationsPreview = ({ resumeInfo }: { resumeInfo: ResumeInfoType }) => {
  // Format date to "Mon YYYY" format
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (!resumeInfo?.certifications || resumeInfo.certifications.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      {/* Section Title */}
      <h2 
        className="font-bold text-[12px] tracking-wider mb-1.5 uppercase text-black border-b border-black pb-0.5"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Certifications
      </h2>

      {/* Certifications List */}
      <div className="mt-0.5">
        <AnimatePresence>
          {resumeInfo.certifications.map((cert, index) => {
            // Determine the URL to use: imageUrl if available, otherwise link
            const certUrl = cert?.imageUrl || cert?.link;
            
            return (
              <div key={index} className="mb-0.5">
                <div className="flex justify-between items-baseline">
                  {/* Bullet + Certification Name */}
                  <div className="flex items-baseline gap-1.5">
                    <span 
                      className="text-[10px] leading-[1.4]"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      •
                    </span>
                    {certUrl ? (
                      <a
                        href={certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:underline leading-[1.4]"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {cert?.name}
                      </a>
                    ) : (
                      <span 
                        className="text-[10px] text-blue-600 leading-[1.4]"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {cert?.name}
                      </span>
                    )}
                  </div>
                  {/* Date on the right in italic */}
                  {cert?.date && (
                    <span 
                      className="text-[9px] text-black italic leading-[1.4]"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {formatDate(cert.date)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CertificationsPreview;
