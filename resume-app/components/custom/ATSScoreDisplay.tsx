"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface ATSScoreDisplayProps {
  resumeData: {
    title: string;
    summary: string;
    experience: any[];
    projects: any[];
    skills: string[];
    education?: any[];
  };
  userId?: string;
  resumeId?: string;
}

interface ATSAnalysis {
  score: number;
  matchPercentage: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: {
    category: string;
    recommendation: string;
    priority: "high" | "medium" | "low";
  }[];
}

const ATSScoreDisplay = ({
  resumeData,
  userId,
  resumeId,
}: ATSScoreDisplayProps) => {
  const { callApi, loading: apiLoading } = useApi();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [showInput, setShowInput] = useState(true);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    try {
      setLoading(true);
      const response = await callApi("/api/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!response) {
        setLoading(false);
        return;
      }

      const analysisData = response.data;
      setAnalysis(analysisData);
      setShowInput(false);

      // Save the ATS score if userId and resumeId are provided
      if (userId && resumeId) {
        try {
          await callApi("/api/ats-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              resumeId,
              atsData: {
                score: analysisData.score,
                matchPercentage: analysisData.matchPercentage,
                jobDescription: jobDescription.trim(),
              },
            }),
          });
        } catch (saveErr) {
          console.error("Failed to save ATS score:", saveErr);
          // Don't show error to user, just log it
        }
      }
    } catch (err) {
      console.error("Failed to analyze resume:", err);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    const colors = {
      high: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600",
      medium:
        "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600",
      low: "bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:text-white dark:hover:bg-green-600",
    };
    return colors[priority];
  };

  if (showInput) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ATS Score Analysis
          </CardTitle>
          <CardDescription>
            Paste a job description to analyze how well your resume matches and
            get improvement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
              disabled={loading}
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              ATS Score Analysis
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInput(true)}
              className="btn-reanalyze"
            >
              Re-analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`${getScoreBgColor(
                analysis.score
              )} p-6 rounded-lg text-center`}
            >
              <div className="text-sm font-medium mb-2 ats-label">ATS Score</div>
              <div
                className={`text-5xl font-bold ${getScoreColor(
                  analysis.score
                )}`}
              >
                {analysis.score}
              </div>
              <div className="text-sm text-gray-600 mt-2">out of 100</div>
            </div>
            <div
              className={`${getScoreBgColor(
                analysis.matchPercentage
              )} p-6 rounded-lg text-center`}
            >
              <div className="text-sm font-medium mb-2 ats-label">Match Percentage</div>
              <div
                className={`text-5xl font-bold ${getScoreColor(
                  analysis.matchPercentage
                )}`}
              >
                {analysis.matchPercentage}%
              </div>
              <div className="text-sm text-gray-600 mt-2">job alignment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Improvements Needed */}
      {analysis.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Missing Keywords
            </CardTitle>
            <CardDescription>
              These keywords from the job description are not in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="destructive">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Actionable Suggestions</CardTitle>
            <CardDescription>
              Prioritized recommendations to improve your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{suggestion.category}</Badge>
                    <Badge className={getPriorityBadge(suggestion.priority)}>
                      {suggestion.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm">{suggestion.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATSScoreDisplay;
