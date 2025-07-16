"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
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

  const [educationalList, setEducationalList] = useState<EducationType[]>([
    {
      id: undefined,
      universityName: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      description: "",
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
      const res = await axios.delete("/api/user/education", {
        data: {
          userId,
          resumeId,
          educationId: educationToRemove.id,
        },
      });

      if (res.data?.success) {
        toast.success("Education removed.");
        setEducationalList((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(res.data?.message || "Failed to remove education.");
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
      const response = await axios.patch("/api/user/education", {
        userId,
        resumeId,
        education: educationalList,
      });

      if (response.data?.success) {
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
      className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg mt-10"
    >
      <h2 className="font-semibold text-xl mb-1">🎓 Education</h2>
      <p className="text-sm text-zinc-500 mb-4">
        Add your education details below.
      </p>

      <AnimatePresence>
        {educationalList.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-200 dark:border-zinc-700 p-4 mb-5 rounded-lg bg-zinc-50 dark:bg-zinc-800"
          >
            <div>
              <label className="text-xs font-medium">University Name</label>
              <Input
                value={item.universityName}
                onChange={(e) =>
                  handleChange(index, "universityName", e.target.value)
                }
                placeholder="e.g., Harvard University"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Degree</label>
              <Input
                value={item.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                placeholder="e.g., B.Sc"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium">Major</label>
              <Input
                value={item.major}
                onChange={(e) => handleChange(index, "major", e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium">Start Date</label>
                <Input
                  type="date"
                  value={item.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium">End Date</label>
                <Input
                  type="date"
                  value={item.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium">Description</label>
              <Textarea
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
                onClick={() => handleRemove(index)}
                disabled={educationalList.length === 1}
                className="flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex justify-start mt-4"
      >
        <Button
          variant="outline"
          onClick={handleAdd}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add More
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex justify-end mt-6"
      >
        <Button
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white flex items-center gap-2 transition"
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Education;
