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
}

const Skills: React.FC<SkillsProps> = ({ enableNext, userId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();
  const [loading, setLoading] = useState(false);

  const [skillsList, setSkillsList] = useState<SkillType[]>([
    {
      id: undefined,
      name: "",
      rating: 0,
    },
  ]);

  // ✅ Prefill from context when mounting
  useEffect(() => {
    if (resumeInfo?.skills && Array.isArray(resumeInfo.skills) && resumeInfo.skills.length > 0) {
      setSkillsList(
        resumeInfo.skills.map((s) => ({
          id: s.id,
          name: s.name || "",
          rating: s.rating || 0,
        }))
      );
    }
  }, [resumeInfo]);

  // ✅ Update context and enableNext whenever skills change
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
  }, [skillsList, setResumeInfo, enableNext]);

  const handleChangeName = (index: number, value: string) => {
    setSkillsList((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const handleChangeRating = (index: number, value: number) => {
    setSkillsList((prev) => {
      const updated = [...prev];
      updated[index].rating = value;
      return updated;
    });
  };

  const handleAdd = () => {
    setSkillsList((prev) => [
      ...prev,
      {
        id: undefined,
        name: "",
        rating: 0,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setSkillsList((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID is missing.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/skills", {
        userId,
        skills: skillsList,
      });

      toast.success("Skills saved successfully!");
      enableNext(true);
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

      {skillsList.map((item, index) => (
        <div key={index} className="flex items-center gap-3 my-3">
          <Input
            placeholder="Skill name"
            value={item.name}
            onChange={(e) => handleChangeName(index, e.target.value)}
          />
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
  );
};

export default Skills;
