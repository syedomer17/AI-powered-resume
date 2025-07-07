// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Header from "@/components/custom/Header"; // Adjust path if needed

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user ?? {
    name: "Anonymous",
    email: "No email",
    image: null,
    login: null,
  };

  return (
    <main>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>
          Welcome,{" "}
          {user.login
            ? user.login // ✅ Show GitHub username if present
            : user.name ?? "Guest"}
          !
        </p>
      </div>
    </main>
  );
}
