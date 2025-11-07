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
import { useApi } from "@/hooks/useApi";
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
  "Custom",
];

const Skills: React.FC<SkillsProps> = ({ enableNext, userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const { callApi, loading: apiLoading } = useApi();
  const [loading, setLoading] = useState(false);
  const [customCategoryInputs, setCustomCategoryInputs] = useState<{
    [key: number]: boolean;
  }>({});

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
      const res = await callApi("/api/user/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          skillId: skillToRemove.id,
        }),
      });

      if (!res) return;

      if (res.success) {
        toast.success("Skill removed.");
        setSkillsList((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(res.message || "Failed to remove skill.");
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
      const response = await callApi("/api/user/skills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeId,
          skills: skillsList,
        }),
      });

      if (!response) {
        setLoading(false);
        return;
      }

      if (response.success) {
        toast.success("Skills Saved!");
        enableNext(true);
      } else {
        toast.error(response.message || "Failed to update skills.");
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
              {customCategoryInputs[index] ? (
                <Input
                  placeholder="Enter custom category"
                  className="h-11 focus:ring-2 focus:ring-purple-500/20 w-full sm:w-48"
                  value={item.category}
                  onChange={(e) =>
                    handleChange(index, "category", e.target.value)
                  }
                  onBlur={() => {
                    if (!item.category) {
                      setCustomCategoryInputs((prev) => ({
                        ...prev,
                        [index]: false,
                      }));
                    }
                  }}
                  autoFocus
                />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                       className="btn-skill-invert flex justify-between w-full sm:w-48 h-11 font-medium"
                    >
                      {item.category || "Select Category"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SKILL_CATEGORIES.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onSelect={() => {
                          if (category === "Custom") {
                            setCustomCategoryInputs((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            handleChange(index, "category", "");
                          } else {
                            handleChange(index, "category", category);
                          }
                        }}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
              className="btn-danger-invert flex items-center gap-1"
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
          className="btn-add-invert flex items-center gap-1 "
        >
          + Add Skill
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

export default Skills;
