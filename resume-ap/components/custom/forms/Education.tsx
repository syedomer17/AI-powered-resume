"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import axios from "axios";
import { toast } from "sonner";

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
}

const Education: React.FC<EducationProps> = ({ enableNext, userId }) => {
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

  // ✅ Prefill the form if coming back with data in context
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
  }, [resumeInfo]);

  // ✅ Update context live whenever educationalList changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: educationalList.map((edu, i) => ({
        id: i + 1,
        ...edu,
      })),
    }));

    enableNext(educationalList.some((e) => e.universityName.trim() !== ""));
  }, [educationalList, setResumeInfo, enableNext]);

  const handleChange = <K extends keyof Omit<EducationType, "id">>(
    index: number,
    field: K,
    value: EducationType[K]
  ) => {
    const updated = [...educationalList];
    updated[index][field] = value;
    setEducationalList(updated);
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

  const handleRemove = (index: number) => {
    const updated = [...educationalList];
    updated.splice(index, 1);
    setEducationalList(updated);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/education", {
        userId,
        education: educationalList,
      });

      toast.success("Education saved successfully!");
      enableNext(true);
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your education details.</p>

      {educationalList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          <div>
            <label className="text-xs">University Name</label>
            <Input
              name="universityName"
              value={item.universityName}
              onChange={(e) =>
                handleChange(index, "universityName", e.target.value)
              }
            />
          </div>
          <div>
            <label className="text-xs">Degree</label>
            <Input
              name="degree"
              value={item.degree}
              onChange={(e) => handleChange(index, "degree", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Major</label>
            <Input
              name="major"
              value={item.major}
              onChange={(e) => handleChange(index, "major", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate}
              onChange={(e) => handleChange(index, "startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate}
              onChange={(e) => handleChange(index, "endDate", e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Description</label>
            <Textarea
              name="description"
              value={item.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
            />
          </div>
          <div className="col-span-2 flex justify-between mt-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAdd}>
                + Add More
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRemove(index)}
                disabled={educationalList.length === 1}
              >
                - Remove
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end mt-3">
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

export default Education;
