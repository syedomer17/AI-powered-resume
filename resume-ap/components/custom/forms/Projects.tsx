"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { generateProjects } from "@/service/AIModel";

type ProjectType = {
  id?: string | number;
  title: string;
  description: string;
  link?: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
};

interface ProjectsProps {
  enableNext?: (value: boolean) => void;
  userId?: string;
  resumeId?: string;
}

const Projects: React.FC<ProjectsProps> = ({ enableNext, userId, resumeId }) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();

  const [projectList, setProjectList] = useState<ProjectType[]>([
    {
      id: "",
      title: "",
      description: "",
      link: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState<ProjectType[] | null>(null);

  useEffect(() => {
    if (
      resumeInfo?.projects &&
      Array.isArray(resumeInfo.projects) &&
      resumeInfo.projects.length > 0
    ) {
      setProjectList(
        resumeInfo.projects.map((proj) => ({
          id: String(proj.id ?? ""),
          title: proj.title || "",
          description: proj.description || "",
          link: proj.link || "",
          startDate: proj.startDate || "",
          endDate: proj.endDate || "",
          currentlyWorking: proj.currentlyWorking || false,
        }))
      );
    }
  }, []);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      projects: projectList.map((proj, i) => ({
        id: i + 1,
        title: proj.title,
        description: proj.description,
        link: proj.link,
        startDate: proj.startDate,
        endDate: proj.endDate,
        currentlyWorking: proj.currentlyWorking,
      })),
    }));

    enableNext?.(projectList.some((p) => p.title.trim() !== ""));
  }, [projectList]);

  const handleChange = (
    index: number,
    field: keyof ProjectType,
    value: string | boolean
  ) => {
    setProjectList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setProjectList((prev) => [
      ...prev,
      {
        id: "",
        title: "",
        description: "",
        link: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setProjectList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!userId) return toast.error("User ID missing.");
    if (!resumeId) return toast.error("Resume ID missing.");

    setLoading(true);
    try {
      const response = await axios.patch("/api/user/projects", {
        userId,
        resumeId,
        project: projectList[0], // adjust saving logic as needed
      });

      if (response.data?.success) {
        toast.success("Project saved!");
        enableNext?.(true);
      } else {
        toast.error(response.data?.message || "Failed to save project.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving project.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!resumeInfo.jobTitle) {
      toast.error("Please enter a job title first");
      return;
    }
    setGenerating(true);
    setOptions(null);
    try {
      const prompt = `
        Based on the job title "${resumeInfo.jobTitle}", generate 2-3 relevant projects in JSON array format.
        Each project should have: title, description, link (optional), startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), currentlyWorking (boolean).
        Return only the JSON array.
      `;
      const generated = await generateProjects(prompt);
      setOptions(generated);
      toast.success("Projects generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate projects");
    } finally {
      setGenerating(false);
    }
  };

  const applyGeneratedProject = (project: ProjectType) => {
    setProjectList((prev) => [
      ...prev,
      {
        id: "",
        title: project.title,
        description: project.description,
        link: project.link || "",
        startDate: project.startDate,
        endDate: project.endDate,
        currentlyWorking: project.currentlyWorking,
      },
    ]);
    enableNext?.(true);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Add your personal or professional projects.</p>

      <div className="flex justify-between items-center mt-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={generating}
          className="border-fuchsia-500 text-fuchsia-500"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            "Generate from AI"
          )}
        </Button>
      </div>

      {options && options.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold mb-2">Generated Projects:</h3>
          <div className="space-y-2 max-h-60 overflow-auto border rounded p-2">
            {options.map((proj, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => applyGeneratedProject(proj)}
                className="justify-start whitespace-normal text-left w-full"
                size="sm"
                type="button"
              >
                {proj.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {projectList.map((field, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          <div>
            <label className="text-xs">Project Title</label>
            <Input
              value={field.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Project Link</label>
            <Input
              value={field.link}
              onChange={(e) => handleChange(index, "link", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input
              type="date"
              value={field.startDate}
              onChange={(e) => handleChange(index, "startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              type="date"
              value={field.endDate}
              onChange={(e) => handleChange(index, "endDate", e.target.value)}
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
            <label className="text-xs">Description</label>
            <RichTextEditor
              value={field.description}
              onChange={(val) => handleChange(index, "description", val)}
            />
          </div>

          {/* Remove button styled like your Skills component */}
          <div className="col-span-2 flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemove(index)}
              disabled={projectList.length === 1}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={handleAdd}>
          + Add More
        </Button>
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

export default Projects;
