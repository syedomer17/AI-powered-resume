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
  resumes: any[]; // replace any with your Resume type if available
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
      <div className="p-10 md:px-20 lg:px-32">
        <h2 className="font-bold text-3xl">My Resume</h2>
        <p>Start Creating AI Resume to your next job</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
          <AddResume userId={user._id.toString()} userEmail={user.email} />
          <ResumeGrid resumes={user.resumes} />
        </div>
      </div>
    </>
  );
}
