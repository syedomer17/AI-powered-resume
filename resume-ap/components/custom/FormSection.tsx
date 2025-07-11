"use client";

import React, { useState } from "react";
import PersonalDetail from "./forms/PersonalDetail";
import Summery from "./forms/Summery";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Skills from "./forms/Skills";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface FormSectionProps {
  resumeId: string;
}

const FormSection: React.FC<FormSectionProps> = ({ resumeId }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <Link href={"/dashboard"}>
            <Button>
              <Home />
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="flex gap-2">
            <LayoutGrid />
            Theme
          </Button>
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
            onClick={() => {
              setActiveFormIndex(activeFormIndex + 1);
              setEnableNext(false);
            }}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {activeFormIndex === 1 && (
        <PersonalDetail
          enableNext={setEnableNext}
          userId={userId}
          resumeId={resumeId}
        />
      )}
      {activeFormIndex === 2 && (
        <Summery enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 3 && (
        <Experience enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 4 && (
        <Education enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
      {activeFormIndex === 5 && (
        <Skills enableNext={setEnableNext} userId={userId} resumeId={resumeId} />
      )}
    </div>
  );
};

export default FormSection;
