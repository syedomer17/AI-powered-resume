"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/custom/Header";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";

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
  const { callApi } = useApiWithRateLimit();

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

      const data = await callApi("/api/ats/analyze-pdf", {
        method: "POST",
        body: form,
      });

      if (!data) {
        setLoading(false);
        return;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze resume");
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
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32 py-6 sm:py-8 md:py-10 bg-background min-h-screen relative pb-24 md:pb-28">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white flex items-center gap-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary dark:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ATS Resume Checker
            </h1>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-1.5 sm:mt-2">
              Analyze your resume against job descriptions to optimize for Applicant Tracking Systems
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-card dark:bg-card/80 backdrop-blur-sm text-card-foreground p-4 sm:p-6 md:p-8 rounded-xl border border-border dark:border-border/60 shadow-sm dark:shadow-lg transition-all mb-6">
            <div className="flex items-start gap-3 mb-6 pb-6 border-b border-border dark:border-border/60">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-1">Upload & Analyze</h2>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Upload your resume and provide the job description to get detailed insights
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* File Upload */}
              <div className="grid gap-3">
                <label className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Upload Resume (PDF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md cursor-pointer"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: 'none'
                    }}
                  >
                    Choose File
                  </label>
                  <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">
                    {file ? file.name : "No file chosen"}
                  </span>
                </div>
                {file && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border/50">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-black dark:text-white truncate">{file.name}</p>
                    <span className="text-xs text-slate-600 dark:text-slate-400 ml-auto shrink-0">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="grid gap-3">
                <label className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste the complete job description here...&#10;&#10;Include:&#10;• Job title and requirements&#10;• Required skills and qualifications&#10;• Job responsibilities&#10;• Preferred experience"
                  rows={12}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="resize-none font-mono text-sm"
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Provide a detailed job description for accurate ATS analysis
                </p>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-border dark:border-border/60">
                <Button 
                  disabled={loading} 
                  onClick={handleAnalyze}
                  size="lg"
                  className="shadow-md w-full sm:w-auto min-w-[180px]"
                  style={{ 
                    backgroundColor: '#000000', 
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Analyze Resume
                    </>
                  )}
                </Button>
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/50 rounded-lg w-full sm:w-auto">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

      {result && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* ATS Score Card */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent p-6 rounded-xl border border-primary/20 dark:border-primary/30 shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-lg">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">ATS Score</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">{result.score}%</p>
                  </div>
                </div>
                <Badge 
                  variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}
                  className="text-xs px-3 py-1"
                >
                  {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
              <Progress value={result.score} className="h-2" />
            </div>

            {/* Match Percentage Card */}
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent p-6 rounded-xl border border-blue-500/20 dark:border-blue-500/30 shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">Match Percentage</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">{result.matchPercentage}%</p>
                  </div>
                </div>
                <Badge 
                  variant={result.matchPercentage >= 75 ? "default" : result.matchPercentage >= 50 ? "secondary" : "destructive"}
                  className="text-xs px-3 py-1"
                >
                  {result.matchPercentage >= 75 ? "Strong" : result.matchPercentage >= 50 ? "Fair" : "Weak"}
                </Badge>
              </div>
              <Progress value={result.matchPercentage} className="h-2" />
            </div>
          </div>

          {/* Strengths Section */}
          <div className="bg-card dark:bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border dark:border-border/60 shadow-sm dark:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
              {result.strengths?.length > 0 && (
                <Badge variant="outline" className="ml-auto">{result.strengths.length}</Badge>
              )}
            </div>
            {result.strengths?.length ? (
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-500/20">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">No strengths identified.</p>
            )}
          </div>

          {/* Improvements Section */}
          <div className="bg-card dark:bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border dark:border-border/60 shadow-sm dark:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Areas for Improvement</h3>
              {result.improvements?.length > 0 && (
                <Badge variant="outline" className="ml-auto">{result.improvements.length}</Badge>
              )}
            </div>
            {result.improvements?.length ? (
              <ul className="space-y-2">
                {result.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-500/20">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">No improvements suggested.</p>
            )}
          </div>

          {/* Missing Keywords Section */}
          <div className="bg-card dark:bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border dark:border-border/60 shadow-sm dark:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Missing Keywords</h3>
              {result.missingKeywords?.length > 0 && (
                <Badge variant="outline" className="ml-auto">{result.missingKeywords.length}</Badge>
              )}
            </div>
            {result.missingKeywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <Badge key={i} variant="secondary" className="text-sm px-3 py-1.5 bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-500/30">
                    {kw}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">No missing keywords detected.</p>
            )}
          </div>

          {/* Suggestions Section */}
          <div className="bg-card dark:bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border dark:border-border/60 shadow-sm dark:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Recommendations</h3>
              {result.suggestions?.length > 0 && (
                <Badge variant="outline" className="ml-auto">{result.suggestions.length}</Badge>
              )}
            </div>
            {result.suggestions?.length ? (
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border/50 dark:border-border/30 hover:border-primary/30 dark:hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {s.category}
                      </span>
                      <Badge
                        variant={s.priority === "high" ? "destructive" : s.priority === "medium" ? "secondary" : "default"}
                        className="shrink-0"
                      >
                        {s.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 leading-relaxed">{s.recommendation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">No suggestions at this time.</p>
            )}
          </div>
        </div>
      )}
        </div>
      </section>
    </>
  );
}
