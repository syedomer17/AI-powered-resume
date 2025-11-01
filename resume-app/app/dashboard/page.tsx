import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import { redirect } from "next/navigation";
import Header from "@/components/custom/Header";
import AddResume from "@/components/custom/AddResume";
import ResumeGrid from "@/components/custom/ResumeGrid";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import DashboardDock from "@/components/custom/DashboardDock";

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

  const user = (await User.findOne({
    email: session.user.email,
  }).lean()) as IUser | null;

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
  <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32 py-6 sm:py-8 md:py-10 bg-background min-h-screen relative pb-24 md:pb-28">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:bg-gradient-to-r dark:from-primary dark:to-primary/70 dark:bg-clip-text dark:text-transparent leading-tight">
              Welcome Back!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground dark:text-muted-foreground/90 mt-1.5 sm:mt-2">
              Start creating AI-powered resumes to land your next job.
            </p>
          </div>
          {/* Quick actions are now available in the bottom DashboardDock */}
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          <AddResume userId={user._id.toString()} userEmail={user.email} />
          <ResumeGrid resumes={user.resumes} user={user} />
        </div>
      </section>
      <DashboardDock userId={user._id.toString()} />
    </>
  );
}
