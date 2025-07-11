"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useResumeInfo } from "@/context/ResumeInfoConext";

type ExperienceType = {
  id?: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
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

  const [experienceList, setExperienceList] = useState<ExperienceType[]>([
    {
      id: "",
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummery: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // ✅ Prefill ONCE when the component mounts
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
          city: exp.city || "",
          state: exp.state || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          currentlyWorking: exp.currentlyWorking || false,
          workSummery: exp.workSummery || "",
        }))
      );
    }
  }, []); // <= only on mount

  // ✅ Update context whenever experienceList changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList.map((exp, i) => ({
        id: i + 1,
        title: exp.title,
        companyName: exp.companyName,
        city: exp.city,
        state: exp.state,
        startDate: exp.startDate,
        endDate: exp.endDate,
        currentlyWorking: exp.currentlyWorking,
        workSummery: exp.workSummery,
      })),
    }));

    enableNext?.(experienceList.some((e) => e.title.trim() !== ""));
  }, [experienceList]); // no need to include setResumeInfo or enableNext

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
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        workSummery: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID missing. Please log in.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/experience", {
        userId,
        resumeId,
        experience: experienceList,
      });
      toast.success("Experience saved!");
      enableNext?.(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your previous job experience.</p>

      {experienceList.map((field, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          <div>
            <label className="text-xs">Position Title</label>
            <Input
              value={field.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Company Name</label>
            <Input
              value={field.companyName}
              onChange={(e) =>
                handleChange(index, "companyName", e.target.value)
              }
            />
          </div>
          <div>
            <label className="text-xs">City</label>
            <Input
              value={field.city}
              onChange={(e) => handleChange(index, "city", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">State</label>
            <Input
              value={field.state}
              onChange={(e) => handleChange(index, "state", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input
              type="date"
              value={field.startDate}
              onChange={(e) =>
                handleChange(index, "startDate", e.target.value)
              }
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              type="date"
              value={field.endDate}
              onChange={(e) =>
                handleChange(index, "endDate", e.target.value)
              }
            />
          </div>
          <div>
            <label className="text-xs">Currently Working</label>
            <Input
              type="checkbox"
              checked={field.currentlyWorking}
              onChange={(e) =>
                handleChange(index, "currentlyWorking", e.target.checked)
              }
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Work Summary</label>
            <RichTextEditor
              value={field.workSummery}
              onChange={(val) => handleChange(index, "workSummery", val)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAdd}>
            + Add More
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRemove(experienceList.length - 1)}
            disabled={experienceList.length === 1}
          >
            - Remove
          </Button>
        </div>
        <Button
          className="bg-fuchsia-500 text-white flex items-center gap-2"
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

export default Experience;