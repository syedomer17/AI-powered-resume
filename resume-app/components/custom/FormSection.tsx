"use client";

import React, { useState } from "react";
import PersonalDetail from "./forms/PersonalDetail";
import Summery from "./forms/Summery";
import Experience from "./forms/Experience";
import Projects from "./forms/Projects"; // ✅ Projects at step 4
import Education from "./forms/Education";  // Step 5
import Skills from "./forms/Skills";        // Step 6
import Certifications from "./forms/Certifications"; // Step 7
import ATSScoreDisplay from "./ATSScoreDisplay"; // Step 8
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ThemeColor from "./ThemeColor";
import Link from "next/link";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { triggerConfetti } from "@/components/firecrackers/ConfettiSideCannons";

interface FormSectionProps {
  resumeId: string;
  userId: string;
  resumeIndex?: number;
}

const FormSection: React.FC<FormSectionProps> = ({ resumeId, userId,resumeIndex  }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const { resumeInfo } = useResumeInfo();

  const router = useRouter();
  // console.log(resumeId,'from fromSection')

  const handleNextClick = () => {
    const nextIndex = activeFormIndex + 1;

    if (nextIndex === 9) {
      if (!userId || !resumeId) {
        toast.error("User or resume ID missing");
        return;
      }
      // Trigger confetti when user completes all resume sections
      triggerConfetti();
      router.push(`/dashboard/resume/${userId}/${resumeId}/view`);
    } else {
      setActiveFormIndex(nextIndex);
      setEnableNext(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex gap-3 items-center">
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              size="icon"
              className="hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <ThemeColor userId={userId} resumeId={resumeId} />
          <div className="hidden sm:block h-6 w-px bg-border" />
          <div className="text-sm text-muted-foreground">
            Step <span className="font-bold text-foreground">{activeFormIndex}</span> of <span className="font-bold text-foreground">8</span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {activeFormIndex > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
              className="flex-1 sm:flex-none hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!enableNext}
            size="sm"
            onClick={handleNextClick}
          >
            {activeFormIndex === 8 ? 'View Resume' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
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
      {activeFormIndex === 7 && (
        <Certifications enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 8 && (
        <div>
          <ATSScoreDisplay 
            resumeData={{
              title: resumeInfo?.jobTitle || "",
              summary: resumeInfo?.summery || "",
              experience: resumeInfo?.experience || [],
              projects: resumeInfo?.projects || [],
              skills: (resumeInfo?.skills || []).map((s: any) => s.name),
              education: resumeInfo?.education || [],
            }}
            userId={userId}
            resumeId={resumeId}
          />
          <div className="mt-6">
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 dark:from-emerald-500 dark:to-blue-500 dark:hover:from-emerald-600 dark:hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
              onClick={() => setEnableNext(true)}
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Continue to View Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSection;
