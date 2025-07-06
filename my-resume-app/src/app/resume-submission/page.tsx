"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import axios from "axios";

export default function ResumeSubmissionPage() {
  const { session, status } = useAuth();
  const [resumeId, setResumeId] = useState("");
  const [companies, setCompanies] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeId.trim() || !companies.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/resume/submit", {
        userId: session?.user?.email,
        resumeId,
        companies: companies.split(",").map((c) => c.trim()),
      });
      setResult(data.submissions);
    } catch (err) {
      console.error(err);
      setResult("Error submitting resumes.");
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="p-4">Loading...</div>;

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Resume</h1>
      <input
        value={resumeId}
        onChange={(e) => setResumeId(e.target.value)}
        placeholder="Resume ID"
        className="w-full border p-2 mb-2"
      />
      <textarea
        value={companies}
        onChange={(e) => setCompanies(e.target.value)}
        placeholder="Comma-separated company names"
        rows={4}
        className="w-full border p-2 mb-2"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Resumes"}
      </button>
      {result && (
        <div className="mt-4">
          {Array.isArray(result) ? (
            <ul className="space-y-2">
              {result.map((r) => (
                <li key={r._id} className="p-2 border rounded">
                  {r.company}: {r.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>{result}</p>
          )}
        </div>
      )}
    </main>
  );
}
