"use client";

import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoConext";
import { generateSummary, SummaryResponse } from "@/service/AIModel";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type SummeryProps = {
  enableNext?: (v: boolean) => void;
};

const Summery: React.FC<SummeryProps> = ({ enableNext }) => {
  const context = useContext(ResumeInfoContext);
  if (!context) return null;

  const { resumeInfo, setResumeInfo } = context;
  const [summery, setSummery] = useState<string>(resumeInfo.summery || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<SummaryResponse | null>(null);

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Summary saved!");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setOptions(null);

    try {
      const summaries = await generateSummary(`
        Depends on job title, give me summary for my resume within 3-4 lines in JSON format.
        Use the keys: fresher, mid-level, experienced, intern.
        Only return the JSON object without extra text.
        Job title: "${resumeInfo.jobTitle}".
      `);

      setOptions(summaries);
      toast.success("Summaries generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate summaries.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enable next when summary has value
  useEffect(() => {
    enableNext?.(summery.trim().length > 0);
  }, [summery, enableNext]);

  // Keep context updated
  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      summery,
    });
  }, [summery]);

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a summary for your resume.</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              className="border-primary text-primary"
              size="sm"
              type="button"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Generating...
                </>
              ) : (
                "Generate from AI"
              )}
            </Button>
          </div>

          {options && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Object.entries(options).map(([level, text]) => (
                <Button
                  key={level}
                  variant="outline"
                  onClick={() => setSummery(text)}
                  type="button"
                  className="justify-start whitespace-normal text-left"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          )}

          <Textarea
            className="mt-5"
            value={summery}
            required
            onChange={(e) => setSummery(e.target.value)}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Summery;
