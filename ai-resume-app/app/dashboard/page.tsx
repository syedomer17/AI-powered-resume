// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserMenu from "@/components/custom/UserMenu"; // Make sure you have this component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <main className="p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserMenu user={user ?? {}} />
      </div>

      <p>Welcome, {user?.name ?? "Guest"}!</p>
    </main>
  );
}
