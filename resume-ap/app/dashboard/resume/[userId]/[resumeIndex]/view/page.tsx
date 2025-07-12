// app/dashboard/resume/[userId]/[resumeId]/view/page.tsx

import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ResumeInfoProvider, ResumeInfoType } from "@/context/ResumeInfoConext";
import Header from "@/components/custom/Header";
import ResumePriview from "@/components/custom/ResumePriview";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { RWebShare } from "react-web-share";

interface Resume {
  _id: mongoose.Types.ObjectId | string;
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

interface UserWithResumes {
  _id: mongoose.Types.ObjectId | string;
  resumes: Resume[];
}

interface ViewPageProps {
  params: {
    userId: string;
    resumeId: string; // MongoDB _id string of the resume subdocument
  };
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { userId, resumeId } = params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(resumeId)
  ) {
    return notFound();
  }

  await connectToDB();

  const userWithResume = await User.findById(userId).lean<UserWithResumes | null>();

  if (!userWithResume || !userWithResume.resumes || userWithResume.resumes.length === 0) {
    return notFound();
  }

  const resume = userWithResume.resumes.find(
    (r: Resume) => r._id.toString() === resumeId
  );

  if (!resume) {
    return notFound();
  }

  const resumeInfo: ResumeInfoType = {
    firstName: resume.personalDetails?.[0]?.firstName || "",
    lastName: resume.personalDetails?.[0]?.lastName || "",
    jobTitle: resume.personalDetails?.[0]?.jobTitle || "",
    address: resume.personalDetails?.[0]?.address || "",
    phone: resume.personalDetails?.[0]?.phone || "",
    email: resume.personalDetails?.[0]?.email || "",
    themeColor: resume.personalDetails?.[0]?.themeColor || "#ff6666",
    summery: resume.summary?.[0]?.text || "",
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
     projects: resume.projects || [],
  };

  const handleDownload = () => {
    window.print();
  };

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
          <div className="flex justify-between px-44 my-10">
            <Button onClick={handleDownload}>Download</Button>
            <RWebShare
              data={{
                text: "Hello Everyone, This is my Resume",
                url: `${process.env.NEXTAUTH_URL}/dashboard/resume/${userId}/${resumeId}/view`,
                title: "Flamingos Resume",
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button>Share</Button>
            </RWebShare>
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
