"use client";

import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
import { toast } from "sonner";

type SkillType = {
  id?: number;
  name: string;
  rating: number;
};

interface SkillsProps {
  enableNext: (value: boolean) => void;
  userId?: string;
  resumeId?: string; // <-- Made optional to handle new resumes
}

const Skills: React.FC<SkillsProps> = ({ enableNext, userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const [loading, setLoading] = useState(false);

  const [skillsList, setSkillsList] = useState<SkillType[]>([
    { id: undefined, name: "", rating: 1 },
  ]);

  // Prefill only once when mounting
  useEffect(() => {
    if (
      resumeInfo?.skills &&
      Array.isArray(resumeInfo.skills) &&
      resumeInfo.skills.length > 0
    ) {
      setSkillsList(
        resumeInfo.skills.map((s) => ({
          id: s.id,
          name: s.name || "",
          rating: s.rating || 1,
        }))
      );
    }
  }, []);

  // Update context & enableNext when skillsList changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: skillsList.map((skill, i) => ({
        id: i + 1,
        name: skill.name,
        rating: skill.rating,
      })),
    }));

    enableNext(skillsList.some((s) => s.name.trim() !== ""));
  }, [skillsList]);

  const handleChangeName = (index: number, value: string) => {
    setSkillsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: value };
      return updated;
    });
  };

  const handleChangeRating = (index: number, value: number) => {
    setSkillsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], rating: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setSkillsList((prev) => [...prev, { id: undefined, name: "", rating: 1 }]);
  };

  const handleRemove = (index: number) => {
    setSkillsList((prev) => prev.filter((_, i) => i !== index));
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your skills.</p>
      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded-lg p-3 gap-2"
          >
            <div className="flex-1">
              <label className="text-xs">Name</label>
              <Input
                placeholder="Skill name"
                value={item.name}
                onChange={(e) => handleChangeName(index, e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 150 }}
              value={item.rating}
              onChange={(val: number) => handleChangeRating(index, val)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemove(index)}
              disabled={skillsList.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}

        <div className="mt-3 flex gap-2">
          <Button variant="outline" onClick={handleAdd}>
            + Add Skill
          </Button>
          <Button
            className="bg-[#9f5bff] text-white flex items-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Skills;
