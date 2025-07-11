"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import { useEffect, useState } from "react";
import axios from "axios";
import FormSection from "./FormSection";
import ResumePriview from "./ResumePriview";
import { Loader2 } from "lucide-react";

export default function ClientResumeWrapper({ resumeId }: { resumeId: string }) {
  const [resumeData, setResumeData] = useState<ResumeInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`/api/resumes/${resumeId}`);
        setResumeData(response.data);
      } catch {
        setResumeData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-semibold">Resume not found.</h2>
      </div>
    );
  }

  return (
    <ResumeInfoProvider defaultValue={resumeData}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection resumeId={resumeId} />
        <ResumePriview />
      </div>
    </ResumeInfoProvider>
  );
}
