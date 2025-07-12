import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Header from "@/components/custom/Header";
import ClientResumeWrapper from "@/components/custom/ClientResumeWrapper";
import mongoose from "mongoose";

interface EditPageParams {
  params: {
    userId: string;
    resumeIndex: string;
  };
}

export default async function EditPage({ params }: EditPageParams) {
  const { userId, resumeIndex } = params;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    notFound();
  }

  // Check user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    notFound();
  }

  // Optional: enforce that session user id matches URL userId for extra security
  // (Assuming session.user.id is MongoDB _id as string)
  if (session.user.id !== userId) {
    notFound();
  }

  await connectToDB();

  // Find user by _id
  const user = await User.findById(userId);
  if (!user || !user.resumes || user.resumes.length === 0) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-semibold">You don&apos;t have any resumes yet.</h2>
      </div>
    );
  }

  // Find resume by resume id (not Mongo _id)
  const resume = user.resumes.find((r: any) => r.id === Number(resumeIndex));
  if (!resume) {
    notFound();
  }

  return (
    <>
      <Header />
      <ClientResumeWrapper userId={userId} resumeId={resume._id.toString()} />
    </>
  );
}
