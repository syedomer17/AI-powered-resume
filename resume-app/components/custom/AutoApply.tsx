"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_apply_link: string;
}

interface AutoApplyProps {
  jobs: Job[];
  resumeId: string;
  onClose?: () => void;
}

interface ApplicationResult {
  jobId: string;
  status: 'success' | 'failed';
  message: string;
  appliedAt: string;
}

const AutoApply = ({ jobs, resumeId, onClose }: AutoApplyProps) => {
  const [applying, setApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ApplicationResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  const handleAutoApply = async () => {
    if (!resumeId) {
      toast.error("Resume ID is required");
      return;
    }

    if (jobs.length === 0) {
      toast.error("No jobs selected for auto-apply");
      return;
    }

    setApplying(true);
    setProgress(0);
    setResults([]);
    setSummary(null);

    try {
      const jobIds = jobs.map(job => job.job_id);
      
      // Simulate progressive updates
      const totalJobs = jobIds.length;
      let completed = 0;

      const response = await axios.post("/api/jobs/auto-apply", {
        jobIds,
        resumeId,
      });

      if (response.data.success) {
        setResults(response.data.data.results);
        setSummary({
          total: response.data.data.total,
          successful: response.data.data.successful,
          failed: response.data.data.failed,
        });
        setProgress(100);

        toast.success(
          `Auto-applied to ${response.data.data.successful} out of ${response.data.data.total} jobs! 🚀`
        );
      }
    } catch (error: any) {
      console.error("Failed to auto-apply:", error);
      
      const errorMessage = error.response?.data?.error || "Failed to auto-apply to jobs";
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const getJobByIdlocal = (jobId: string) => {
    return jobs.find(job => job.job_id === jobId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Auto Apply to Jobs
        </CardTitle>
        <CardDescription>
          Automatically apply to {jobs.length} selected jobs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Jobs Summary */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>{jobs.length} jobs</strong> selected for auto-apply
          </p>
        </div>

        {/* Progress Bar */}
        {applying && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Applying to jobs...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Application Summary:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-lg font-bold">{summary.successful}</span>
                <span className="text-xs text-gray-500">Success</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <XCircle className="w-5 h-5 text-red-500 mb-1" />
                <span className="text-lg font-bold">{summary.failed}</span>
                <span className="text-xs text-gray-500">Failed</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <Zap className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-lg font-bold">{summary.total}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h4 className="font-semibold text-sm">Application Results:</h4>
            {results.map((result, index) => {
              const job = getJobByIdlocal(result.jobId);
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded border ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {result.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {job?.job_title || result.jobId}
                    </p>
                    <p className="text-xs text-gray-600">{job?.employer_name || 'Company'}</p>
                    <p className="text-xs text-gray-500 mt-1">{result.message}</p>
                  </div>
                  {job?.job_apply_link && (
                    <a
                      href={job.job_apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Mode Notice */}
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-800">
            <strong>Demo Mode:</strong> Auto-apply is simulated for demonstration. 
            In production, this would integrate with LinkedIn Easy Apply, Indeed Quick Apply, etc.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAutoApply}
            disabled={applying || jobs.length === 0}
            className="flex-1"
          >
            {applying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Auto Apply to {jobs.length} Jobs
              </>
            )}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={applying}>
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoApply;
