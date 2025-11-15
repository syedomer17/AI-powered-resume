"use client";

import { Loader2, PlusSquare } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";

interface AddResumeProps {
  userId: string;
  userEmail: string;
}

const AddResume = ({ userId, userEmail }: AddResumeProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("Full Stack Developer");
  const [customTitle, setCustomTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { callApi, loading: apiLoading } = useApi();

  const handleCreateResume = async () => {
    const finalTitle =
      selectedTitle === "Custom" ? customTitle.trim() : selectedTitle;

    if (!finalTitle) return;

    try {
      setLoading(true);

      const payload = {
        title: finalTitle,
        userEmail: userEmail,
        userName: session?.user?.name || "",
        userId: userId,
        jobDescription: jobDescription.trim() || undefined, // Include job description if provided
      };

      const res = await callApi("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res) {
        setLoading(false);
        return;
      }

      const createdResume = res?.data?.resume;
      if (!createdResume) throw new Error("Resume creation failed.");

      const resumeIndex = createdResume.id;

      setOpenDialog(false);
      setCustomTitle("");
      setSelectedTitle("Full Stack Developer");
      setJobDescription("");

      router.push(`/dashboard/resume/${userId}/${resumeIndex}/edit`);
    } catch (err) {
      console.error("Failed to create resume:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add Resume Button */}
      <div
        onClick={() => setOpenDialog(true)}
        className="items-center flex flex-col justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl shadow-md hover:shadow-xl cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 group transition-all duration-300 p-6 h-[240px]"
      >
        <div className="w-16 h-16 mb-3 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          <PlusSquare className="w-8 h-8 text-white" />
        </div>
        <span className="text-base font-bold text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Add New Resume
        </span>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New Resume</DialogTitle>
            <DialogDescription>
              <p className="mb-3 text-sm sm:text-base">Select a title for your new resume</p>

              {/* Select Dropdown */}
              <Select
                value={selectedTitle}
                onValueChange={(value) => setSelectedTitle(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom Title Input */}
              {selectedTitle === "Custom" && (
                <Input
                  className="mt-3 w-full"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter your custom title"
                  disabled={loading}
                />
              )}

              {/* Job Description Textarea */}
              <div className="mt-4">
                <label htmlFor="jobDescription" className="text-sm font-medium text-foreground block">
                  Job Description (Optional)
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Paste the job description here to generate a tailored resume using AI
                </p>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[120px] sm:min-h-[150px] mt-1 w-full"
                  disabled={loading}
                />
              </div>
            </DialogDescription>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-5 mt-4">
              <Button
                onClick={() => setOpenDialog(false)}
                variant="ghost"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 w-full sm:w-auto [&_svg]:text-white dark:[&_svg]:text-black"
                onClick={handleCreateResume}
                disabled={
                  loading ||
                  (selectedTitle === "Custom" && customTitle.trim().length === 0)
                }
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
