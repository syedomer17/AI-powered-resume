"use client";

import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import Header from "@/components/custom/Header";
import ResumePriview from "@/components/custom/ResumePriview";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

interface Resume {
  _id: string;
  id: number;
  personalDetails?: Array<{
    firstName: string;
    lastName: string;
    jobTitle: string;
    address: string;
    phone: string;
    email: string;
    themeColor: string;
  }>;
  summary?: Array<{ text: string }>;
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
}

interface ViewPageProps {
  params: {
    userId: string;
    resumeId: string; // This will be ignored in favor of API response
  };
}

export default function ViewPage({ params }: ViewPageProps) {
  const { userId } = params;
  const [resumeInfo, setResumeInfo] = useState<ResumeInfoType | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}`);
        const user = res.data.user;

        console.log("Fetched user:", user);

        if (!user || !user.resumes || user.resumes.length === 0) {
          console.warn("No resumes found");
          return;
        }

        const resumeIdFromRes = user.resumes[0]._id;
        setResumeId(resumeIdFromRes);

        const resume = user.resumes.find((r: Resume) => r._id === resumeIdFromRes);

        if (!resume) {
          console.warn("Resume not found");
          return;
        }

        const info: ResumeInfoType = {
          firstName: resume.personalDetails?.[0]?.firstName ?? "",
          lastName: resume.personalDetails?.[0]?.lastName ?? "",
          jobTitle: resume.personalDetails?.[0]?.jobTitle ?? "",
          address: resume.personalDetails?.[0]?.address ?? "",
          phone: resume.personalDetails?.[0]?.phone ?? "",
          email: resume.personalDetails?.[0]?.email ?? "",
          themeColor: resume.personalDetails?.[0]?.themeColor ?? "#ff6666",
          summery: resume.summary?.[0]?.text ?? "",
          experience: resume.experience ?? [],
          education: resume.education ?? [],
          skills: resume.skills ?? [],
          projects: resume.projects ?? [],
          hasPersonalDetails: !!resume.personalDetails?.length,
        };

        console.log("Mapped ResumeInfo:", info);
        setResumeInfo(info);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleDownload = () => {
    const element = document.getElementById("print-area");
    console.log("Download clicked, element:", element);

    if (!element) {
      console.warn("Element with ID 'print-area' not found.");
      return;
    }

    // Wait 100ms to ensure the DOM is fully rendered
    setTimeout(() => {
      html2pdf()
        .from(element)
        .set({
          margin: 0,
          filename: "resume.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        })
        .save();
    }, 100);
  };

  if (!resumeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading resume...
      </div>
    );
  }

  return (
    <ResumeInfoProvider defaultValue={resumeInfo}>
      <div id="no-print">
        <Header />
        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Resume is Ready
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download and share your resume.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 my-10">
            <Button onClick={handleDownload}>Download as PDF</Button>
            {resumeId && (
              <RWebShare
                data={{
                  text: "Hello Everyone, This is my Resume",
                  url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/resume/${userId}/${resumeId}/view`,
                  title: "Flamingos Resume",
                }}
                onClick={() => console.log("shared successfully!")}
              >
                <Button>Share</Button>
              </RWebShare>
            )}
          </div>
        </div>

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <div id="print-area">
            <ResumePriview />
          </div>
        </div>
      </div>
    </ResumeInfoProvider>
  );
}
