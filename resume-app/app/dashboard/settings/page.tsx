import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User, { type IUser } from "@/models/User";
import Header from "@/components/custom/Header";
import SettingsForm from "../../../components/custom/SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  await connectToDB();
  const user = (await User.findOne({ email: session.user.email }).lean()) as unknown as IUser | null;
  if (!user) redirect("/login");

  return (
    <>
      <Header />
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32 py-6 sm:py-8 md:py-10 bg-background min-h-screen relative pb-24 md:pb-28">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white">
              Account Settings
            </h1>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-1.5 sm:mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <SettingsForm
            initialUser={{
              userName: user.userName ?? "",
              email: user.email ?? "",
              avatar: user.avatar ?? "",
              bio: user.bio ?? "",
            }}
          />
        </div>
      </section>
    </>
  );
}
