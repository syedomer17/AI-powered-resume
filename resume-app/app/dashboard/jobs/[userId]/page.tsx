import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Header from "@/components/custom/Header";
import JobSearch from "@/components/custom/JobSearch";
import mongoose from "mongoose";

interface JobSearchPageParams {
  params: {
    userId: string;
  };
}

export default async function JobSearchPage({ params }: JobSearchPageParams) {
  const { userId } = await params;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    notFound();
  }

  // Check user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    notFound();
  }

  // Optional: enforce that session user id matches URL userId
  if (session.user.id !== userId) {
    notFound();
  }

  await connectToDB();

  // Find user by _id
  const user = await User.findById(userId);
  if (!user) {
    notFound();
  }

  // Extract all skills from all resumes
  const allSkills: string[] = [];
  user.resumes.forEach((resume: any) => {
    if (resume.skills && Array.isArray(resume.skills)) {
      resume.skills.forEach((skill: any) => {
        if (skill.name && !allSkills.includes(skill.name)) {
          allSkills.push(skill.name);
        }
      });
    }
  });
  
  // Get the first resume ID if available (or you could let user select)
  const firstResumeId = user.resumes.length > 0 ? user.resumes[0]._id.toString() : undefined;

  return (
    <>
      <Header />
      <div className="p-10">
        <JobSearch 
          userSkills={allSkills} 
          resumeId={firstResumeId}
        />
      </div>
    </>
  );
}
