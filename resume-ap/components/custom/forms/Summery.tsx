"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { generateSummary, SummaryResponse } from "@/service/AIModel";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface SummeryProps {
  enableNext: (v: boolean) => void;
  userId?: string;
  resumeId: string;  // Added this line
}

const Summery: React.FC<SummeryProps> = ({ enableNext, userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const [summary, setSummary] = useState<string>(""); // start empty
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<SummaryResponse | null>(null);

  // Prefill once on mount
  useEffect(() => {
    if (resumeInfo?.summery) {
      setSummary(resumeInfo.summery);
      enableNext(resumeInfo.summery.trim().length > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  // Keep context updated when summary changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      summery: summary,
    }));
  }, [summary, setResumeInfo]);

  // Handle AI generation
  const handleGenerate = async () => {
    setLoading(true);
    setOptions(null);

    try {
      const summaries = await generateSummary(`
        Based on the job title, create a 3–4 line resume summary in JSON format.
        Keys: fresher, mid-level, experienced, intern.
        Only return the JSON object.
        Job title: "${resumeInfo.jobTitle || ""}".
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

  // Save summary to server
  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User ID not available.");
      return;
    }
    if (!resumeId) {
      toast.error("Resume ID not available.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/user/summery", {
        userId,
        resumeId,      // <-- Include resumeId in the request body
        text: summary,
      });

      if (response.data?.success) {
        toast.success("Summary saved!");
      } else {
        toast.error(response.data?.message || "Failed to save summary.");
      }
    } catch (err) {
      console.error("Error saving summary:", err);
      toast.error("Server error while saving summary.");
    } finally {
      setLoading(false);
    }
  };

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
                  onClick={() => {
                    setSummary(text);
                    enableNext(true);
                  }}
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
            value={summary}
            required
            placeholder="Write your summary here..."
            onChange={(e) => {
              setSummary(e.target.value);
              enableNext(e.target.value.trim().length > 0);
            }}
          />

          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              className="bg-[#9f5bff] text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Summery;
