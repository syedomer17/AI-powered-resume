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
      className="p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6"
    >
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          Skills
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Select categories and specify your skills
        </p>
      </div>

      <AnimatePresence>
        {skillsList.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-border rounded-xl bg-muted/30 p-4 mb-4 gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-3 w-full flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex justify-between w-full sm:w-48 h-11 font-medium"
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
                className="h-11 focus:ring-2 focus:ring-blue-500/20"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemove(index)}
              disabled={skillsList.length === 1}
              className="flex items-center gap-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 "
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap justify-between mt-6 gap-2">
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 "
        >
          + Add Skill
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

export default Skills;
