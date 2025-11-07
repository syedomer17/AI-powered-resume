"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Loader2, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { generateExperience, AIExperience } from "@/service/AIModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExperienceType = {
  id?: string;
  title: string;
  companyName: string;
  workType: string; // Remote, Hybrid, In-office
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  workSummery: string;
};

interface ExperienceProps {
  enableNext?: (value: boolean) => void;
  userId?: string;
  resumeId?: string;
}

const Experience: React.FC<ExperienceProps> = ({
  enableNext,
  userId,
  resumeId,
}) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const { callApi, loading: apiLoading } = useApi();

  const [experienceList, setExperienceList] = useState<ExperienceType[]>([
    {
      id: "",
      title: "",
      companyName: "",
      workType: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummery: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (
      resumeInfo?.experience &&
      Array.isArray(resumeInfo.experience) &&
      resumeInfo.experience.length > 0
    ) {
      setExperienceList(
        resumeInfo.experience.map((exp) => ({
          id: String(exp.id ?? ""),
          title: exp.title || "",
          companyName: exp.companyName || "",
          workType: exp.workType || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          currentlyWorking: exp.currentlyWorking || false,
          workSummery: exp.workSummery || "",
        }))
      );
    }
  }, []);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList.map((exp, i) => ({
        id: i + 1,
        title: exp.title,
        companyName: exp.companyName,
        workType: exp.workType,
        startDate: exp.startDate,
        endDate: exp.endDate,
        currentlyWorking: exp.currentlyWorking,
        workSummery: exp.workSummery,
      })),
    }));

    enableNext?.(experienceList.some((e) => e.title.trim() !== ""));
  }, [experienceList, enableNext, setResumeInfo]);

  const handleChange = (
    index: number,
    field: keyof ExperienceType,
    value: string | boolean
  ) => {
    setExperienceList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setExperienceList((prev) => [
      ...prev,
      {
        id: "",
        title: "",
        companyName: "",
        workType: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        workSummery: "",
      },
    ]);
  };

  const handleRemove = async (index: number) => {
    const experienceToRemove = experienceList[index];

    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }

    if (!experienceToRemove?.id) {
      // No id—just remove locally (unsaved item)
      setExperienceList((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // If it has an id—delete from DB
    try {
      const res = await callApi("/api/user/experience", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          experienceId: experienceToRemove.id,
        }),
      });

      if (!res) return;

      if (res.success) {
        toast.success("Experience removed.");
        setExperienceList((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(res.message || "Failed to remove experience.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing experience.");
    }
  };

  const handleSave = async () => {
    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }
    setLoading(true);
    try {
      const response = await callApi("/api/user/experience", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          experience: experienceList,
        }),
      });

      if (!response) {
        setLoading(false);
        return;
      }

      if (response.success) {
        toast.success("Experience saved!");
        enableNext?.(true);
      } else {
        toast.error(response.message || "Failed to save.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!resumeInfo.jobTitle) {
      toast.error("Enter your job title before generating experience.");
      return;
    }
    setGenerating(true);
    try {
      const generated: AIExperience[] = await generateExperience(`
        Based on the job title "${resumeInfo.jobTitle}", generate 2-3 relevant experiences.
      `);
      setExperienceList(
        generated.map((exp, i) => ({
          id: String(i + 1),
          title: exp.title,
          companyName: exp.companyName,
          workType: "",
          startDate: exp.startDate,
          endDate: exp.endDate,
          currentlyWorking: exp.currentlyWorking,
          workSummery: exp.workSummery,
        }))
      );
      toast.success("Experience generated!");
      enableNext?.(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate experience.");
    } finally {
      setGenerating(false);
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
          <span className="text-2xl">💼</span>
          Professional Experience
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add your previous job experience below
        </p>
      </div>

      <AnimatePresence>
        {experienceList.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border p-5 mb-5 rounded-xl bg-muted/30"
          >
            <div>
              <label className="text-sm font-medium text-foreground">
                Position Title
              </label>
              <Input
                className="capitalize mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Company Name
              </label>
              <Input
                className="capitalize mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.companyName}
                onChange={(e) =>
                  handleChange(index, "companyName", e.target.value)
                }
              />
            </div>

            {/* Work Type Dropdown */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Work Type
              </label>
              <Select
                value={field.workType}
                onValueChange={(value) =>
                  handleChange(index, "workType", value)
                }
              >
                <SelectTrigger className="mt-1 h-11 bg-white dark:bg-background text-black dark:text-white border-border">
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-background text-black dark:text-white border-border">
                  <SelectItem
                    value="Remote"
                    className="text-black dark:text-white hover:bg-accent"
                  >
                    Remote
                  </SelectItem>
                  <SelectItem
                    value="Hybrid"
                    className="text-black dark:text-white hover:bg-accent"
                  >
                    Hybrid
                  </SelectItem>
                  <SelectItem
                    value="In-office"
                    className="text-black dark:text-white hover:bg-accent"
                  >
                    In-office
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Start Date
                </label>
                <Input
                  type="date"
                  className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={field.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  End Date
                </label>
                <Input
                  type="date"
                  className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={field.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.currentlyWorking}
                onChange={(e) =>
                  handleChange(index, "currentlyWorking", e.target.checked)
                }
                className="w-4 h-4 accent-purple-500"
              />
              <label className="text-sm font-medium text-foreground">
                Currently Working
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Work Summary
              </label>
              <div className="mt-1">
                <RichTextEditor
                  value={field.workSummery}
                  onChange={(val) => handleChange(index, "workSummery", val)}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <Button
                variant="outline"
                onClick={() => handleRemove(index)}
                disabled={experienceList.length === 1}
                className="btn-danger-invert flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-between mt-6 gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAdd}
            className="btn-add-invert flex items-center gap-1 "
          >
            + Add More
          </Button>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-save-invert shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          {loading && <Loader2 className="spinner w-4 h-4 animate-spin" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

export default Experience;
