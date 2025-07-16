"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { generateSummary, SummaryResponse } from "@/service/AIModel";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface SummeryProps {
  enableNext: (v: boolean) => void;
  userId?: string;
  resumeId: string;
}

const Summery: React.FC<SummeryProps> = ({ enableNext, userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<SummaryResponse | null>(null);

  useEffect(() => {
    if (resumeInfo?.summery) {
      setSummary(resumeInfo.summery);
      enableNext(resumeInfo.summery.trim().length > 0);
    }
  }, [resumeInfo?.summery, enableNext]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      summery: summary,
    }));
  }, [summary, setResumeInfo]);

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

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !resumeId) {
      toast.error("Missing user or resume ID");
      return;
    }

    setLoading(true);
    try {
      await axios.patch("/api/user/summery", {
        userId,
        resumeId,
        text: summary,
      });
      toast.success("Summary saved!");
    } catch (error) {
      toast.error("Failed to save summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg mt-10"
    >
      <h2 className="font-semibold text-xl mb-1">📝 Summary</h2>
      <p className="text-sm text-zinc-500 mb-4">
        Add a professional summary for your resume.
      </p>

      <form onSubmit={onSave} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <label htmlFor="summary-textarea" className="font-medium">
            Your Summary
          </label>
          <Button
            variant="outline"
            className="border-fuchsia-500 text-fuchsia-500"
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {Object.entries(options).map(([level, text]) => (
              <Button
                key={level}
                variant="outline"
                onClick={() => {
                  setSummary(text);
                  enableNext(true);
                  setOptions(null);
                }}
                type="button"
                className="justify-start whitespace-normal text-left"
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </motion.div>
        )}

        <Textarea
          id="summary-textarea"
          className="mt-2 min-h-[120px]"
          value={summary}
          required
          placeholder="Write your summary here..."
          onChange={(e) => {
            setSummary(e.target.value);
            enableNext(e.target.value.trim().length > 0);
            setOptions(null);
          }}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white flex items-center gap-2 transition"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default Summery;
