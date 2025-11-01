"use client";

import { useEffect } from "react";
import ResumeCardItem from "./resume-item/ResumeCardItem";
import { json } from "stream/consumers";

interface ResumeType {
  _id: string;
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ResumeGrid({
  resumes,
  user,
}: {
  resumes: ResumeType[];
  user: any;
}) {
    if (!resumes || resumes.length === 0) {
    return (
      <div className="col-span-full text-center py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-muted dark:bg-muted/50 flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base dark:text-muted-foreground/80 font-medium">
            No resumes yet
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm dark:text-muted-foreground/60 mt-2">
            Click "Add New Resume" to create your first AI-powered resume!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {resumes.map((resume, index) => (
        <ResumeCardItem key={resume._id} resume={resume} index={index} />
      ))}
    </>
  );
}
