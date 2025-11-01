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
      <section className="px-6 py-10 md:px-20 lg:px-32 bg-gray-50 min-h-screen">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
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
