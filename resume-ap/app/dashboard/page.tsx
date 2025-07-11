import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Header from "@/components/custom/Header";
import AddResume from "@/components/custom/AddResume";
import ResumeGrid from "@/components/custom/ResumeGrid";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

interface IUser {
  _id: string;
  email: string;
  resumes: any[];
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  await connectToDB();

  const user = (await User.findOne({ email: session.user.email }).lean()) as IUser | null;

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <section className="px-6 py-10 md:px-20 lg:px-32 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-1">
            Start creating AI-powered resumes to land your next job.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AddResume userId={user._id.toString()} userEmail={user.email} />
          <ResumeGrid resumes={user.resumes} />
        </div>
      </section>
    </>
  );
}
