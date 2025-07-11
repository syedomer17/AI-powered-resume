"use client";

import { Loader2 } from "lucide-react";
import ResumeCardItem from "./resume-item/ResumeCardItem";

interface ResumeType {
  _id: string;
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ResumeGrid({ resumes }: { resumes: ResumeType[] }) {
  if (!resumes || resumes.length === 0) {
    return (
      <p className="text-gray-500 mt-4 col-span-full">
        No resumes yet. Create your first resume!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 col-span-full">
      {resumes.map((resume, index) => (
        <ResumeCardItem key={resume._id} resume={resume} index={index} />
      ))}
    </div>
  );
}
