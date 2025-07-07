"use client";

import { useEffect, useState } from "react";
import { getAllResumes } from "@/service/GlobalApi";
import { Loader2 } from "lucide-react";
import ResumeCardItem from "./resume-item/ResumeCardItem";

export default function ResumeGrid() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const res = await getAllResumes();
        setResumes(res.data);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center col-span-full mt-10">
        <Loader2 className="animate-spin" />
        <span className="ml-2">Loading resumes...</span>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <p className="text-gray-500 mt-4 col-span-full">
        No resumes yet. Create your first resume!
      </p>
    );
  }

  return (
    <>
      {resumes.map((resume) => (
        <ResumeCardItem key={resume._id} resume={resume} />
      ))}
    </>
  );
}
