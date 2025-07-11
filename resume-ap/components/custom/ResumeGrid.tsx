"use client";

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
      <div className="col-span-full text-center py-6">
        <p className="text-gray-500 text-sm">
          You haven’t created any resumes yet. Click "Add Resume" to get started!
        </p>
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
