"use client";

import { ResumeInfoProvider } from "@/context/ResumeInfoConext";
import FormSection from "@/components/custom/FormSection";
import ResumePreview from "@/components/custom/ResumePriview";

export default function Edit() {
  return (
    <ResumeInfoProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoProvider>
  );
}
