"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import ResumePriview from "@/components/custom/ResumePriview";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PrintPage() {
  const params = useParams();
  const userId = params.userId as string;
  const resumeId = params.resumeId as string;

  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // console.log('Fetching resume:', { userId, resumeId });
        const res = await fetch(`/api/user/${userId}/resume/${resumeId}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          // console.error("Failed to fetch resume:", res.status, errorData);
          setLoading(false);
          return;
        }

        const data = await res.json();
        // console.log('Resume API response:', data);
        const resume = data.resume;

        if (!resume) {
          // console.warn("Resume not found in response");
          setLoading(false);
          return;
        }

        const personal = resume.personalDetails?.[0] ?? {};

        const info: ResumeInfoType = {
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
          hasPersonalDetails: !!resume.personalDetails?.length,
        };

        setResumeInfo(info);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        setResumeInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [userId, resumeId]);

  // Always render the print-area div, but show loading/error states inside it
  return (
    <div id="print-area" className="bg-white min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
        </div>
      ) : !resumeInfo ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Resume not found</p>
        </div>
      ) : (
        <ResumeInfoProvider defaultValue={resumeInfo}>
          <ResumePriview />
        </ResumeInfoProvider>
      )}
    </div>
  );
}
