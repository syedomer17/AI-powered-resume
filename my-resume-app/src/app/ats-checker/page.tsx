"use client";
import { useState } from "react";
import axios from "axios";

export default function ATSCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    const { data } = await axios.post("/api/ats", {
      resumeText,
      keywords: keywords.split(",").map((k) => k.trim()),
    });
    setResult(data);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">ATS Checker</h1>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume text..."
        className="w-full border p-2 mb-4"
        rows={6}
      />
      <input
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Comma-separated keywords"
        className="w-full border p-2 mb-4"
      />
      <button onClick={handleCheck} className="bg-blue-500 text-white px-4 py-2">
        Check ATS Score
      </button>
      {result && (
        <div className="mt-4">
          <p>Score: {result.atsScore}%</p>
          <p>
            {result.matches} of {result.totalKeywords} keywords matched.
          </p>
        </div>
      )}
    </main>
  );
}
