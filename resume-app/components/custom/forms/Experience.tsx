"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Loader2, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { generateExperience, AIExperience } from "@/service/AIModel";
import { motion, AnimatePresence } from "framer-motion";
import { Country, State, City } from "country-state-city";
import { Combobox } from "@/components/ui/combobox";

type ExperienceType = {
  id?: string;
  title: string;
  companyName: string;
  country: string; // ISO code
  state: string; // ISO code
  city: string; // full city name
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

// Helpers to get full names
const getCountryName = (code: string) => {
  if (!code) return "";
  const country = Country.getCountryByCode(code);
  return country ? country.name : "";
};

const getStateName = (countryCode: string, stateCode: string) => {
  if (!countryCode || !stateCode) return "";
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  return state ? state.name : "";
};

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
      country: "",
      state: "",
      city: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummery: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

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
          country: exp.country || "",
          state: exp.state || "",
          city: exp.city || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          currentlyWorking: exp.currentlyWorking || false,
          workSummery: exp.workSummery || "",
        }))
      );
    }
  }, []);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList.map((exp, i) => ({
        id: i + 1,
        title: exp.title,
        companyName: exp.companyName,
        country: exp.country,
        state: exp.state,
        city: exp.city,
        startDate: exp.startDate,
        endDate: exp.endDate,
        currentlyWorking: exp.currentlyWorking,
        workSummery: exp.workSummery,
      })),
    }));

    enableNext?.(experienceList.some((e) => e.title.trim() !== ""));
  }, [experienceList, enableNext, setResumeInfo]);

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
        country: "",
        state: "",
        city: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        workSummery: "",
      },
    ]);
  };

  const handleRemove = async (index: number) => {
    const experienceToRemove = experienceList[index];

    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }

    if (!experienceToRemove?.id) {
      // No id—just remove locally (unsaved item)
      setExperienceList((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // If it has an id—delete from DB
    try {
      const res = await axios.delete("/api/user/experience", {
        data: {
          userId,
          resumeId,
          experienceId: experienceToRemove.id,
        },
      });

      if (res.data?.success) {
        toast.success("Experience removed.");
        setExperienceList((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(res.data?.message || "Failed to remove experience.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing experience.");
    }
  };

  const handleSave = async () => {
    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch("/api/user/experience", {
        userId,
        resumeId,
        experience: experienceList,
      });
      if (response.data?.success) {
        toast.success("Experience saved!");
        enableNext?.(true);
      } else {
        toast.error(response.data?.message || "Failed to save.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!resumeInfo.jobTitle) {
      toast.error("Enter your job title before generating experience.");
      return;
    }
    setGenerating(true);
    try {
      const generated: AIExperience[] = await generateExperience(`
        Based on the job title "${resumeInfo.jobTitle}", generate 2-3 relevant experiences.
      `);
      setExperienceList(
        generated.map((exp, i) => ({
          id: String(i + 1),
          title: exp.title,
          companyName: exp.companyName,
          country: "",
          state: "",
          city: "",
          startDate: exp.startDate,
          endDate: exp.endDate,
          currentlyWorking: exp.currentlyWorking,
          workSummery: exp.workSummery,
        }))
      );
      toast.success("Experience generated!");
      enableNext?.(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate experience.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg mt-10"
    >
      <h2 className="font-semibold text-xl mb-1">💼 Professional Experience</h2>
      <p className="text-sm text-zinc-500 mb-4">
        Add your previous job experience below.
      </p>

      <div className="flex justify-end mb-3">
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate from AI"
          )}
        </Button>
      </div>

      <AnimatePresence>
        {experienceList.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-zinc-200 dark:border-zinc-700 p-4 mb-5 rounded-lg bg-zinc-50 dark:bg-zinc-800"
          >
            <div>
              <label className="text-xs font-medium">Position Title</label>
              <Input
                className="capitalize"
                value={field.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium">Company Name</label>
              <Input
                className="capitalize"
                value={field.companyName}
                onChange={(e) =>
                  handleChange(index, "companyName", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium">Country</label>
              <Combobox
                options={Country.getAllCountries().map((c) => ({
                  label: c.name,
                  value: c.isoCode,
                }))}
                value={field.country}
                onChange={(value) => {
                  handleChange(index, "country", value);
                  handleChange(index, "state", "");
                  handleChange(index, "city", "");
                }}
                placeholder="Select country"
              />
            </div>
            <div>
              <label className="text-xs font-medium">State</label>
              <Combobox
                options={
                  field.country
                    ? State.getStatesOfCountry(field.country).map((s) => ({
                        label: s.name,
                        value: s.isoCode,
                      }))
                    : []
                }
                value={field.state}
                onChange={(value) => {
                  handleChange(index, "state", value);
                  handleChange(index, "city", "");
                }}
                placeholder="Select state"
                disabled={!field.country}
              />
            </div>
            <div>
              <label className="text-xs font-medium">City</label>
              <Combobox
                options={
                  field.country && field.state
                    ? City.getCitiesOfState(field.country, field.state).map(
                        (c) => ({
                          label: c.name,
                          value: c.name,
                        })
                      )
                    : []
                }
                value={field.city}
                onChange={(value) => handleChange(index, "city", value)}
                placeholder="Select city"
                disabled={!field.state}
              />
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Start Date</label>
                <Input
                  type="date"
                  value={field.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium">End Date</label>
                <Input
                  type="date"
                  value={field.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.currentlyWorking}
                onChange={(e) =>
                  handleChange(index, "currentlyWorking", e.target.checked)
                }
                className="w-4 h-4 accent-fuchsia-500"
              />
              <label className="text-xs font-medium">Currently Working</label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium">Work Summary</label>
              <RichTextEditor
                value={field.workSummery}
                onChange={(val) => handleChange(index, "workSummery", val)}
              />
            </div>
            <div className="sm:col-span-2 mt-2 text-sm text-zinc-500">
              <strong>Location:</strong> {field.city || "—"}
              {field.city ? ", " : ""}
              {getStateName(field.country, field.state) || "—"}
              {field.state ? ", " : ""}
              {getCountryName(field.country) || "—"}
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <Button
                variant="outline"
                onClick={() => handleRemove(index)}
                disabled={experienceList.length === 1}
                className="flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-between mt-4 gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAdd}>
            + Add More
          </Button>
        </div>
        <Button
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save
        </Button>
      </div>
    </motion.div>
  );
};

export default Experience;
