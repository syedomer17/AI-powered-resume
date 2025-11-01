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
      className="p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6"
    >
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Professional Summary
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add a professional summary for your resume
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <label htmlFor="summary-textarea" className="text-sm font-medium text-foreground">
            Your Summary
          </label>
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 rounded-lg"
          >
            <p className="col-span-full text-sm font-medium text-foreground mb-2">Select a summary level:</p>
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
                className="justify-start whitespace-normal text-left h-auto py-3 hover:bg-purple-500/10 hover:border-purple-500/50"
              >
                <span className="font-semibold">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </Button>
            ))}
          </motion.div>
        )}

        <div className="space-y-2">
          <label htmlFor="summary-textarea" className="text-sm font-medium text-foreground">
            Summary Text
          </label>
          <Textarea
            id="summary-textarea"
            className="min-h-[150px] transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            value={summary}
            required
            placeholder="Write your professional summary here..."
            onChange={(e) => {
              setSummary(e.target.value);
              enableNext(e.target.value.trim().length > 0);
              setOptions(null);
            }}
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Summery;
