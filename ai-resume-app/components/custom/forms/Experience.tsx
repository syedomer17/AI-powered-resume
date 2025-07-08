"use client";

import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoConext";
import { Loader2 } from "lucide-react";

type ExperienceItem = {
  id: number;
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
  resumeId: string;
  enableNext?: (v: boolean) => void;
}

const Experience: React.FC<ExperienceProps> = ({ resumeId,enableNext }) => {
  const context = useContext(ResumeInfoContext);
  if (!context) return null;
  const { resumeInfo, setResumeInfo } = context;

  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [saving, setSaving] = useState(false);

  // Load data
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/resume/${resumeId}/experience`);
        const data: { success: boolean; experience: ExperienceItem[] } = await res.json();
        if (data.success && Array.isArray(data.experience)) {
          setExperienceList(data.experience.length ? data.experience : [createEmptyExperience()]);
        } else {
          setExperienceList([createEmptyExperience()]);
        }
      } catch (error) {
        console.error("Error fetching experience:", error);
        setExperienceList([createEmptyExperience()]);
      }
    };
    fetchExperience();
  }, [resumeId]);

  // Sync context
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList,
    }));
  }, [experienceList, setResumeInfo]);

  const createEmptyExperience = (): ExperienceItem => ({
    id: Math.floor(Math.random() * 1000000), // Generate a temp ID
    title: "",
    companyName: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    workSummery: "",
  });

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updated = [...experienceList];
    updated[index] = {
      ...updated[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setExperienceList(updated);
  };

  const handleSummaryChange = (index: number, value: string) => {
    const updated = [...experienceList];
    updated[index].workSummery = value;
    setExperienceList(updated);
  };

  const addExperience = () => {
    setExperienceList((prev) => [...prev, createEmptyExperience()]);
  };

  const removeExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const handleSave = async () => {
  try {
    setSaving(true);
    const res = await fetch(`/api/resumes/${resumeId}/experience`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ experience: experienceList }),
    });

    const data = await res.json();
    if (data.success) {
      console.log("Experience saved successfully.");
    } else {
      console.error("Failed to save experience:", data.message);
    }
  } catch (error) {
    console.error("Error saving experience:", error);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your previous job experience.</p>

      {experienceList.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          <div>
            <label className="text-xs">Position Title</label>
            <Input
              name="title"
              value={field.title}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">Company Name</label>
            <Input
              name="companyName"
              value={field.companyName}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">City</label>
            <Input
              name="city"
              value={field.city}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">State</label>
            <Input
              name="state"
              value={field.state}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={field.startDate}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={field.endDate}
              onChange={(e) => handleChange(index, e)}
              disabled={field.currentlyWorking}
            />
          </div>
          <div>
            <label className="text-xs">Currently Working</label>
            <Input
              type="checkbox"
              name="currentlyWorking"
              checked={field.currentlyWorking}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div className="col-span-2">
            <RichTextEditor
              value={field.workSummery}
              onChange={(value) => handleSummaryChange(index, value)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" className="text-primary" onClick={addExperience}>
            + Add More Experience
          </Button>
          <Button
            variant="outline"
            className="text-primary"
            disabled={experienceList.length <= 1}
            onClick={removeExperience}
          >
            - Remove
          </Button>
        </div>
        <Button
          className="bg-fuchsia-500 text-white flex items-center gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving && <Loader2 className="animate-spin w-4 h-4" />}
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Experience;
