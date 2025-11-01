"use client";

import { useParams } from "next/navigation";
import Experience from "@/components/custom/forms/Experience";
import { useSession } from "next-auth/react";

export default function ResumePage() {
  const params = useParams();
  const resumeId = params.id;
  console.log(resumeId,"hello from resumeid");

  const { data: session, status } = useSession();

  if (!resumeId || typeof resumeId !== "string") {
    return <div className="text-destructive">Invalid resume ID.</div>;
  }

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session?.user?.id) {
    return <div className="text-destructive">You must be logged in to edit experience.</div>;
    // Or you could redirect to login using useRouter
  }

  const userId = session.user.id;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Edit Experience</h1>
      <Experience resumeId={resumeId} userId={userId} />
    </main>
  );
}
