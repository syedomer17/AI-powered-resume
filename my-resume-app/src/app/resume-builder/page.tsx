"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import axios from "axios";

export default function ResumeBuilderPage() {
  const { session, status } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState("");

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !skills.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/resume/generate", {
        userId: session?.user?.email,
        jobTitle,
        skills: skills.split(",").map((s) => s.trim()),
      });
      setGenerated(data.resume.content);
    } catch (err) {
      console.error(err);
      setGenerated("Error generating resume.");
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="p-4">Loading...</div>;

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Resume Generator</h1>
      <input
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Job Title"
        className="w-full border p-2 mb-2"
      />
      <input
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Comma-separated skills"
        className="w-full border p-2 mb-2"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Resume"}
      </button>
      {generated && (
        <textarea
          value={generated}
          readOnly
          rows={10}
          className="w-full border p-2 mt-4"
        />
      )}
    </main>
  );
}
