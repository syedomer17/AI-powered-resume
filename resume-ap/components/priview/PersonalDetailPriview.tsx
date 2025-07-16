"use client";

import { ResumeInfoType } from "@/context/ResumeInfoConext";
import { Mail, Phone } from "lucide-react";

export default function PersonalDetailPriview({
  resumeInfo,
}: {
  resumeInfo: ResumeInfoType;
}) {
  const themeColor = resumeInfo?.themeColor || "#9f5bff";

  return (
    <div className="my-4 space-y-1">
      {/* Name */}
      <h2
        className="font-bold text-xl text-center tracking-tight capitalize"
        style={{ color: themeColor }}
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>

      {/* Job Title */}
      {resumeInfo?.jobTitle && (
        <h2 className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
          {resumeInfo.jobTitle}
        </h2>
      )}

      {/* Address */}
      {resumeInfo?.address && (
        <h2
          className="text-center text-xs font-normal capitalize"
          style={{ color: themeColor }}
        >
          {resumeInfo.address}
        </h2>
      )}

      {/* Contact */}
      <div
        className="
          flex flex-col items-center gap-1 mt-2 text-xs 
          sm:flex-row sm:justify-between sm:items-center
        "
      >
        {resumeInfo?.phone && (
          <div
            className="flex items-center gap-1"
            style={{ color: themeColor }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{resumeInfo.phone}</span>
          </div>
        )}

        {resumeInfo?.email && (
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${resumeInfo.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline cursor-pointer"
            style={{ color: themeColor }}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{resumeInfo.email}</span>
          </a>
        )}
      </div>

      {/* Divider */}
      <hr className="border-[1.5px] mt-3" style={{ borderColor: themeColor }} />
    </div>
  );
}
