"use client";

import React, { useState } from "react";
import PersonalDetail from "./forms/PersonalDetail";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import Summery from "./forms/Summery";
import Experience from "./forms/Experience";

interface FormSectionProps {
  resumeId: string;
}

const FormSection: React.FC<FormSectionProps> = ({ resumeId }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid />
          Theme
        </Button>
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
              setEnableNext(false); // reset for next step
            }}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {activeFormIndex === 1 && (
        <PersonalDetail enableNext={(v) => setEnableNext(v)} />
      )}
      {activeFormIndex === 2 && (
        <Summery enableNext={(v) => setEnableNext(v)} />
      )}
      {activeFormIndex === 3 && (
        <Experience enableNext={(v) => setEnableNext(v)} resumeId={resumeId} />
      )}
    </div>
  );
};

export default FormSection;
