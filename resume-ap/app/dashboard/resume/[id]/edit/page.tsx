import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ResumeInfoProvider } from "@/context/ResumeInfoConext";
import FormSection from "@/components/custom/FormSection";
import ResumePreview from "@/components/custom/ResumePriview";
import Header from "@/components/custom/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EditPage() {
  // Get session on the server
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound(); // or redirect to login if you prefer
  }

  await connectToDB();

  // Find the user by email
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    notFound();
  }

  if (!user.resumes || user.resumes.length === 0) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-semibold">
          You don&apos;t have any resumes yet.
        </h2>
      </div>
    );
  }

  // Pick the first resume (or change this logic)
  const resume = user.resumes[0];

  return (
    <ResumeInfoProvider>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection resumeId={resume.id.toString()} />
        <ResumePreview />
      </div>
    </ResumeInfoProvider>
  );
}
