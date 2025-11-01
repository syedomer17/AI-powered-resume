import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Header from "@/components/custom/Header";
import JobSearch from "@/components/custom/JobSearch";
import mongoose from "mongoose";

interface JobSearchPageParams {
  params: Promise<{
    userId: string;
  }>;
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
      <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Job Search
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover opportunities that match your skills and experience
          </p>
        </div>
        <JobSearch 
          userSkills={allSkills} 
          resumeId={firstResumeId}
        />
      </div>
    </>
  );
}
