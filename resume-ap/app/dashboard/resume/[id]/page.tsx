"use client";

import { useParams } from "next/navigation";
import Experience from "@/components/custom/forms/Experience";
import { useSession } from "next-auth/react";

export default function ResumePage() {
  const params = useParams();
  const resumeId = params.id;
  const { data: session, status } = useSession();

  if (!resumeId || typeof resumeId !== "string") {
    return <div>Invalid resume ID.</div>;
  }

  // Handle loading or unauthenticated session
  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userId = session.user.id;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Experience</h1>
      <Experience resumeId={resumeId} userId={userId} />
    </main>
  );
}
