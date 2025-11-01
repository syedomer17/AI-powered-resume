"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Loader2, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useResumeInfo } from "@/context/ResumeInfoConext";
import { generateProjects } from "@/service/AIModel";
import { motion, AnimatePresence } from "framer-motion";

type ProjectType = {
  id?: string | number;
  title: string;
  techStack: string;
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

const Projects: React.FC<ProjectsProps> = ({
  enableNext,
  userId,
  resumeId,
}) => {
  const { resumeInfo, setResumeInfo } = useResumeInfo();

  const [projectList, setProjectList] = useState<ProjectType[]>([
    {
      id: 1,
      title: "",
      techStack: "",
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
        resumeInfo.projects.map((proj, i) => ({
          id: proj.id ?? i + 1,
          title: proj.title || "",
          techStack: proj.techStack || "",
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
        techStack: proj.techStack,
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
    const newId =
      projectList.length > 0
        ? Math.max(...projectList.map((p) => Number(p.id) || 0)) + 1
        : 1;

    setProjectList((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        techStack: "",
        description: "",
        link: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  const handleRemove = async (index: number) => {
    const projectToRemove = projectList[index];
    console.log("Deleting project:", projectToRemove);

    if (!userId || !resumeId) {
      toast.error("User or Resume ID missing.");
      return;
    }

    // If the project was never saved, just remove locally
    if (!projectToRemove?.id) {
      setProjectList((prev) => prev.filter((_, i) => i !== index));
      await handleSave(); // keep backend in sync
      return;
    }

    try {
      const res = await axios.delete("/api/user/projects", {
        data: {
          userId,
          resumeId,
          projectId: projectToRemove.id,
        },
      });

      if (res.data?.success) {
        toast.success("Project removed.");

        // Update local state with the returned updated list from backend
        setProjectList(
          res.data.projects.map((proj: any) => ({
            id: proj.id,
            title: proj.title,
            techStack: proj.techStack,
            description: proj.description,
            link: proj.link,
            startDate: proj.startDate,
            endDate: proj.endDate,
            currentlyWorking: proj.currentlyWorking,
          }))
        );
      } else {
        toast.error(res.data?.message || "Failed to remove project.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing project.");
    }
  };

  const handleSave = async () => {
    if (!userId) return toast.error("User ID missing.");
    if (!resumeId) return toast.error("Resume ID missing.");

    setLoading(true);
    try {
      const response = await axios.patch("/api/user/projects", {
        userId,
        resumeId,
        projects: projectList,
      });

      if (response.data?.success) {
        toast.success("Projects saved!");
        // Update local state with normalized IDs returned from backend
        setProjectList(
          response.data.projects.map((proj: any) => ({
            id: proj.id,
            title: proj.title,
            techStack: proj.techStack,
            description: proj.description,
            link: proj.link,
            startDate: proj.startDate,
            endDate: proj.endDate,
            currentlyWorking: proj.currentlyWorking,
          }))
        );
        enableNext?.(true);
      } else {
        toast.error(response.data?.message || "Failed to save projects.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving projects.");
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
        Each project should have: title, techStack (comma-separated technologies), description, link (optional), startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), currentlyWorking (boolean).
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
        techStack: project.techStack || "",
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6"
    >
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl">�</span>
          Projects
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add your personal or professional projects
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 "
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate from AI"
          )}
        </Button>
      </div>

      {options && options.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 mb-6"
        >
          <h3 className="font-semibold mb-3 text-foreground">Generated Projects</h3>
          <div className="space-y-2 max-h-60 overflow-auto border border-border rounded-lg p-3 bg-purple-50/50 dark:bg-purple-950/20">
            {options.map((proj, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => applyGeneratedProject(proj)}
                className="justify-start whitespace-normal text-left w-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                {proj.title}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {projectList.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border p-5 my-5 rounded-xl bg-muted/30"
          >
            <div>
              <label className="text-sm font-medium text-foreground">Project Title</label>
              <Input
                className="capitalize mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="e.g., Portfolio Website"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Project Link</label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.link}
                onChange={(e) => handleChange(index, "link", e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Tech Stack */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Tech Stack</label>
              <Input
                className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                value={field.techStack}
                onChange={(e) => handleChange(index, "techStack", e.target.value)}
                placeholder="e.g., Next.js, TailwindCSS, Auth.js, MongoDB, Shadcn, Gemini AI"
              />
            </div>

            {/* Start and End Dates */}
            <div className="flex flex-col sm:flex-row gap-4 sm:col-span-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <Input
                  type="date"
                  className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={field.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">End Date</label>
                <Input
                  type="date"
                  className="mt-1 h-11 focus:ring-2 focus:ring-blue-500/20"
                  value={field.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Checkbox below the dates */}
            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={field.currentlyWorking}
                onChange={(e) =>
                  handleChange(index, "currentlyWorking", e.target.checked)
                }
                className="w-4 h-4 accent-purple-500"
              />
              <label className="text-sm font-medium text-foreground">Currently Working</label>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <div className="mt-1">
                <RichTextEditor
                  value={field.description}
                  onChange={(val) => handleChange(index, "description", val)}
                />
              </div>
            </div>

            {/* Remove button */}
            <div className="sm:col-span-2 flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={projectList.length === 1}
                className="flex items-center gap-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 "
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 "
        >
          + Add More
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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

export default Projects;
