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
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";

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
  const { callApi, isCoolingDown } = useApiWithRateLimit();

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
        className="p-8 sm:p-10 md:p-14 py-16 sm:py-20 md:py-24 items-center flex flex-col justify-center bg-secondary dark:bg-secondary/50 rounded-lg h-60 sm:h-[260px] md:h-[280px] hover:scale-105 transition-all hover:shadow-md dark:hover:shadow-xl cursor-pointer border-2 border-dotted dark:border-border/60 hover:border-primary dark:hover:border-primary group"
      >
        <PlusSquare className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="mt-3 text-sm sm:text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">
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
                className="bg-[#9f5bff] w-full sm:w-auto"
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
