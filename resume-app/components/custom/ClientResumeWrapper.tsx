"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import { useEffect, useState } from "react";
import axios from "axios";
import FormSection from "./FormSection";
import ResumePriview from "./ResumePriview";
import { Loader2 } from "lucide-react";

interface ClientResumeWrapperProps {
  userId: string;
  resumeId: string;
  resumeIndex?: number;
}

export default function ClientResumeWrapper({
  userId,
  resumeId,
  resumeIndex, // ✅ include this
}: ClientResumeWrapperProps) {
  const [resumeData, setResumeData] = useState<ResumeInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`/api/resumes/${resumeId}`);
        const resume = response.data.resume;

        const personal = resume.personalDetails?.[0] ?? {};

        const transformedData: ResumeInfoType = {
          firstName: personal.firstName || "",
          lastName: personal.lastName || "",
          jobTitle: personal.jobTitle || "",
          address: personal.address || "",
          phone: personal.phone || "",
          email: personal.email || "",
          themeColor: personal.themeColor || "#ff6666",
          summery: resume.summary?.[0]?.text || "",
          country: personal.country || "",
          state: personal.state || "",
          city: personal.city || "",
          linkedIn: personal.linkedIn || "",
          linkedInUsername: personal.linkedInUsername || "",
          github: personal.github || "",
          githubUsername: personal.githubUsername || "",
          twitter: personal.twitter || "",
          twitterUsername: personal.twitterUsername || "",
          medium: personal.medium || "",
          mediumUsername: personal.mediumUsername || "",
          experience: resume.experience || [],
          education: resume.education || [],
          skills: resume.skills || [],
          projects: resume.projects || [],
          certifications: resume.certifications || [],
        };

        setResumeData(transformedData);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        setResumeData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // console.log(resumeId,'from clientResumeWraper')

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
        <FormSection
          userId={userId}
          resumeId={resumeId.toString()}
          resumeIndex={resumeIndex} // ✅ pass it here
        />
        <ResumePriview />
      </div>
    </ResumeInfoProvider>
  );
}
