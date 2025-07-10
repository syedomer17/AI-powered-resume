"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import ResumeCardItem from "./resume-item/ResumeCardItem";
import { useSession } from "next-auth/react";

interface ResumeType {
  _id: string;
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ResumeGrid() {
  const [resumes, setResumes] = useState<ResumeType[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(`/api/resumes?userId=${userId}`);
        setResumes(res.data || []);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [userId]);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {resumes.map((resume) => (
        <ResumeCardItem key={resume._id} resume={resume} />
      ))}
    </div>
  );
}
