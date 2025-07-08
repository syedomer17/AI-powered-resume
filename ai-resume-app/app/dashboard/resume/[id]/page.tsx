// app/resume/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Experience from "@/components/custom/forms/Experience";

export default function ResumePage() {
  const params = useParams();
  const resumeId = params?.id as string;

  if (!resumeId) return <div>Invalid resume ID.</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Experience</h1>
      <Experience resumeId={resumeId} />
    </main>
  );
}
