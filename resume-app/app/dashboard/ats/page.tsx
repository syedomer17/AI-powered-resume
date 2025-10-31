"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/custom/Header";

type ATSScoreResponse = {
  score: number;
  matchPercentage: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: { category: string; recommendation: string; priority: "high" | "medium" | "low" }[];
};

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSScoreResponse | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please upload your resume (PDF)");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file);
      form.append("jobDescription", jobDescription);

      const res = await fetch("/api/ats/analyze-pdf", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to analyze resume");
      }

      setResult(data.data as ATSScoreResponse);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="px-6 py-10 md:px-20 lg:px-32 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8 bg-white rounded-md shadow-sm">
      <h1 className="text-2xl font-semibold mb-2">ATS Checker</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Upload your resume (PDF) and paste a job description to see your ATS score, match percentage, and suggestions.
      </p>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Upload Resume (PDF)</label>
          <Input type="file" accept="application/pdf" onChange={onFileChange} />
          {file && (
            <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Job Description</label>
          <Textarea
            placeholder="Paste the job description here..."
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700" disabled={loading} onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze ATS"}
          </Button>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>

      {result && (
        <div className="mt-10 grid gap-6">
          <section className="grid gap-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ATS Score</span>
                <span className="text-sm font-semibold">{result.score}%</span>
              </div>
              <Progress value={result.score} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Match Percentage</span>
                <span className="text-sm font-semibold">{result.matchPercentage}%</span>
              </div>
              <Progress value={result.matchPercentage} />
            </div>
          </section>

          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">Strengths</h3>
            {result.strengths?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm">{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No strengths identified.</p>
            )}
          </section>

          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">Improvements</h3>
            {result.improvements?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {result.improvements.map((s, i) => (
                  <li key={i} className="text-sm">{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No improvements suggested.</p>
            )}
          </section>

          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">Missing Keywords</h3>
            {result.missingKeywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">{kw}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No missing keywords detected.</p>
            )}
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-semibold">Suggestions</h3>
            {result.suggestions?.length ? (
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{s.category}</span>
                      <Badge
                        className={
                          s.priority === "high"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : s.priority === "medium"
                            ? "bg-yellow-600 text-white hover:bg-yellow-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }
                      >
                        {s.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.recommendation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No suggestions at this time.</p>
            )}
          </section>
        </div>
      )}
        </div>
      </section>
    </>
  );
}
