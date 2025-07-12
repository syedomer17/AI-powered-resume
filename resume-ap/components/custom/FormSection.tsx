"use client";

import React, { useState } from "react";
import PersonalDetail from "./forms/PersonalDetail";
import Summery from "./forms/Summery";
import Experience from "./forms/Experience";
import Projects from "./forms/Projects"; // ✅ Projects at step 4
import Education from "./forms/Education";  // Step 5
import Skills from "./forms/Skills";        // Step 6
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ThemeColor from "./ThemeColor";
import Link from "next/link";

interface FormSectionProps {
  resumeId: string;
  userId: string;
  resumeIndex?: number;
}

const FormSection: React.FC<FormSectionProps> = ({ resumeId, userId }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  const router = useRouter();

  const handleNextClick = () => {
    const nextIndex = activeFormIndex + 1;

    if (nextIndex === 7) {
      if (!userId || !resumeId) {
        toast.error("User or resume ID missing");
        return;
      }
      router.push(`/dashboard/resume/${userId}/${resumeId}/view`);
    } else {
      setActiveFormIndex(nextIndex);
      setEnableNext(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-5">
          <Link href="/dashboard">
            <Button className="bg-[#9f5bff]">
              <Home />
            </Button>
          </Link>
          <ThemeColor userId={userId} resumeId={resumeId} />
        </div>

        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              className="bg-[#9f5bff]"
              size="sm"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft />
            </Button>
          )}
          <Button
            className="flex gap-2 bg-[#9f5bff]"
            disabled={!enableNext}
            size="sm"
            onClick={handleNextClick}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {activeFormIndex === 1 && (
        <PersonalDetail enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 2 && (
        <Summery enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 3 && (
        <Experience enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 4 && (
        <Projects enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 5 && (
        <Education enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 6 && (
        <Skills enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
    </div>
  );
};

export default FormSection;
