"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { session, status } = useAuth();

  if (status === "loading") {
    return <div className="p-8">
      <LoadingSpinner />
    </div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex items-center space-x-4 mb-6">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="User avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome, {session?.user?.name || session?.user?.email || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card
          href="/ats-checker"
          title="ATS Checker"
          description="Check how your resume scores for keywords."
          color="blue"
        />
        <Card
          href="/resume-builder"
          title="AI Resume Builder"
          description="Generate or update your resume with AI."
          color="green"
        />
        <Card
          href="/resume-upload"
          title="Upload Resume"
          description="Upload your resume and store in your account."
          color="yellow"
        />
        <Card
          href="/resume-submission"
          title="Submit to Companies"
          description="One-click resume submission to top companies."
          color="purple"
        />
      </div>
    </main>
  );
}

function Card({
  href,
  title,
  description,
  color,
}: {
  href: string;
  title: string;
  description: string;
  color: string;
}) {
  const baseColor = {
    blue: "bg-blue-100 dark:bg-blue-900",
    green: "bg-green-100 dark:bg-green-900",
    yellow: "bg-yellow-100 dark:bg-yellow-900",
    purple: "bg-purple-100 dark:bg-purple-900",
  }[color];

  const hoverColor = {
    blue: "hover:bg-blue-200 dark:hover:bg-blue-800",
    green: "hover:bg-green-200 dark:hover:bg-green-800",
    yellow: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    purple: "hover:bg-purple-200 dark:hover:bg-purple-800",
  }[color];

  return (
    <Link
      href={href}
      className={`block p-4 rounded-lg transition shadow-sm ${baseColor} ${hoverColor} hover:scale-[1.02]`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p>{description}</p>
    </Link>
  );
}
