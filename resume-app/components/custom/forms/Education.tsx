"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type EducationType = {
  id?: number;
  universityName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
  city: string;
  country: string;
};

interface EducationProps {
  enableNext: (value: boolean) => void;
  userId?: string;
  resumeId: string;
}

const Education: React.FC<EducationProps> = ({
  enableNext,
  userId,
  resumeId,
}) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const { callApi, loading: apiLoading } = useApi();

  const [educationalList, setEducationalList] = useState<EducationType[]>([
    {
      id: undefined,
      universityName: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      description: "",
      city: "",
      country: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      resumeInfo?.education &&
      Array.isArray(resumeInfo.education) &&
      resumeInfo.education.length > 0
    ) {
      setEducationalList(
        resumeInfo.education.map((edu) => ({
          id: edu.id,
          universityName: edu.universityName || "",
          degree: edu.degree || "",
          major: edu.major || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          description: edu.description || "",
          city: edu.city || "",
          country: edu.country || "",
        }))
      );
    }
  }, []);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: educationalList.map((edu, i) => ({
        id: i + 1,
        ...edu,
      })),
    }));

    enableNext(educationalList.some((e) => e.universityName.trim() !== ""));
  }, [educationalList]);

  const handleChange = <K extends keyof Omit<EducationType, "id">>(
    index: number,
    field: K,
    value: EducationType[K]
  ) => {
    setEducationalList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setEducationalList((prev) => [
      ...prev,
      {
        id: undefined,
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
        city: "",
        country: "",
      },
    ]);
  };

  const handleRemove = async (index: number) => {
    const educationToRemove = educationalList[index];

    if (!educationToRemove?.id) {
      // Not saved yet—just remove locally
      setEducationalList((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }

    try {
      const res = await callApi("/api/user/education", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          educationId: educationToRemove.id,
        }),
      });

      if (!res) return;

      if (res.success) {
        toast.success("Education removed.");
        setEducationalList((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(res.message || "Failed to remove education.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing education.");
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }
    if (!resumeId) {
      toast.error("Resume ID is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await callApi("/api/user/education", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          education: educationalList,
        }),
      });

      if (!response) {
        setLoading(false);
        return;
      }

      if (response.success) {
        toast.success("Education Saved!");
        enableNext(true);
      } else {
        toast.error(
          response.data?.message || "Failed to save education details."
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to save education details."
      );
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
          <span className="text-2xl">🎓</span>
          Education
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add your education details below
        </p>
      </div>

      <AnimatePresence>
        {educationalList.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border p-5 mb-5 rounded-xl bg-muted/30"
          >
            <div>
              <label className="text-sm font-medium text-foreground">
                University Name
              </label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={item.universityName}
                onChange={(e) =>
                  handleChange(index, "universityName", e.target.value)
                }
                placeholder="e.g., Harvard University"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Degree
              </label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={item.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                placeholder="e.g., B.Sc"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Major
              </label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={item.major}
                onChange={(e) => handleChange(index, "major", e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                City
              </label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={item.city}
                onChange={(e) => handleChange(index, "city", e.target.value)}
                placeholder="e.g., Hyderabad"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Country
              </label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={item.country}
                onChange={(e) => handleChange(index, "country", e.target.value)}
                placeholder="e.g., India"
              />
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">
                  Start Date
                </label>
                <Input
                  type="date"
                  className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={item.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">
                  End Date
                </label>
                <Input
                  type="date"
                  className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={item.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                className="mt-1 min-h-24 focus:ring-2 focus:ring-blue-500/20"
                value={item.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                placeholder="Describe your coursework, achievements, or experiences."
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={educationalList.length === 1}
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
        <Button
          variant="outline"
          onClick={handleAdd}
          className="btn-add-invert flex items-center gap-1 "
        >
          <Plus className="w-4 h-4" />
          Add More
        </Button>
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

export default Education;
