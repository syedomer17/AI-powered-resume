"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

type SkillType = {
  id?: number;
  category: string;
  name: string;
};

interface SkillsProps {
  enableNext: (value: boolean) => void;
  userId?: string;
  resumeId?: string;
}

const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Data Science",
  "AI/ML",
  "Other",
];

const Skills: React.FC<SkillsProps> = ({ enableNext, userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const [loading, setLoading] = useState(false);

  const [skillsList, setSkillsList] = useState<SkillType[]>([
    { id: undefined, category: "", name: "" },
  ]);

  useEffect(() => {
    if (
      resumeInfo?.skills &&
      Array.isArray(resumeInfo.skills) &&
      resumeInfo.skills.length > 0
    ) {
      setSkillsList(
        resumeInfo.skills.map((s) => ({
          id: s.id,
          category: s.category || "",
          name: s.name || "",
        }))
      );
    }
  }, []);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: skillsList.map((skill, i) => ({
        id: i + 1,
        category: skill.category,
        name: skill.name,
      })),
    }));

    enableNext(skillsList.some((s) => s.category && s.name));
  }, [skillsList]);

  const handleAdd = () => {
    setSkillsList((prev) => [
      ...prev,
      { id: undefined, category: "", name: "" },
    ]);
  };

  const handleRemove = async (index: number) => {
    const skillToRemove = skillsList[index];

    if (!skillToRemove?.id) {
      // Not saved yet—just remove locally
      setSkillsList((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }

    try {
      const res = await axios.delete("/api/user/skills", {
        data: {
          userId,
          resumeId,
          skillId: skillToRemove.id,
        },
      });

      if (res.data?.success) {
        toast.success("Skill removed.");
        setSkillsList((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(res.data?.message || "Failed to remove skill.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing skill.");
    }
  };

  const handleChange = (
    index: number,
    field: keyof SkillType,
    value: string
  ) => {
    setSkillsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!userId || !resumeId) {
      toast.error("Missing user or resume ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch("/api/user/skills", {
        userId,
        resumeId,
        skills: skillsList,
      });

      if (response.data?.success) {
        toast.success("Skills Saved!");
        enableNext(true);
      } else {
        toast.error(response.data?.message || "Failed to update skills.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skills.");
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
      <h2 className="font-semibold text-xl mb-1">🛠️ Skills</h2>
      <p className="text-sm text-zinc-500 mb-4">
        Select categories and specify your skills.
      </p>

      <AnimatePresence>
        {skillsList.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3 mb-3 gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-2 w-full flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex justify-between w-full sm:w-40"
                  >
                    {item.category || "Select Category"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {SKILL_CATEGORIES.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onSelect={() => handleChange(index, "category", category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                placeholder="Skill name"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemove(index)}
              disabled={skillsList.length === 1}
              className="flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap justify-between mt-4 gap-2">
        <Button variant="outline" onClick={handleAdd}>
          + Add Skill
        </Button>
        <Button
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white flex items-center gap-2 transition"
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

export default Skills;
