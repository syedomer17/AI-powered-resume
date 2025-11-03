"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Mail, Send, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";
import { toast } from "sonner";

interface SendToHRProps {
  resumeId: string;
  resumePdfUrl?: string; // optional uploaded resume link
  onClose?: () => void;
}

const SendToHR = ({ resumeId, resumePdfUrl, onClose }: SendToHRProps) => {
  const { callApi } = useApiWithRateLimit();
  const [jobTitle, setJobTitle] = useState("Software Developer");
  const [hrCount, setHRCount] = useState(50);
  const [totalHRs, setTotalHRs] = useState(100);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    // Fetch total HR count
    fetchHRStatus();
  }, []);

  const fetchHRStatus = async () => {
    try {
      const response = await callApi("/api/jobs/send-to-hr");
      if (!response) return;

      if (response.success) {
        setTotalHRs(response.data.totalHRContacts);
      }
    } catch (error) {
      console.error("Failed to fetch HR status:", error);
    }
  };

  const handleSendToHR = async () => {
    if (!resumeId) {
      toast.error("Resume ID is required");
      return;
    }

    if (!jobTitle.trim()) {
      toast.error("Job title is required");
      return;
    }

    setSending(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const response = await callApi("/api/jobs/send-to-hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          jobTitle,
          hrCount,
          resumePdfUrl,
        }),
      });

      if (!response) {
        clearInterval(progressInterval);
        setSending(false);
        return;
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.success) {
        setResult({
          sent: response.data.data.sent,
          failed: response.data.data.failed,
          total: response.data.data.total,
        });

        toast.success(`Successfully sent to ${response.data.data.sent} HR contacts! 🎉`);
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("Failed to send to HR:", error);
      
      const errorMessage = error.response?.data?.error || "Failed to send resume to HR";
      toast.error(errorMessage);
      
      setResult({
        sent: 0,
        failed: hrCount,
        total: hrCount,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full border-l-4 border-l-emerald-500 dark:border-l-emerald-400 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
            <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          Send Resume to HR
        </CardTitle>
        <CardDescription className="text-xs">
          Automatically send your resume to {totalHRs} HR contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="text-foreground">Job Title</span>
            <span className="text-xs text-muted-foreground">(Required)</span>
          </label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Software Developer, Product Manager"
            disabled={sending}
            className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="w-3 h-3" />
            This will be used in the email subject line
          </p>
        </div>

        {/* HR Count Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center justify-between">
            <span className="text-foreground">Number of HR Contacts</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{hrCount}</span>
          </label>
          <input
            type="range"
            min="10"
            max={totalHRs}
            step="10"
            value={hrCount}
            onChange={(e) => setHRCount(parseInt(e.target.value))}
            disabled={sending}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10 contacts</span>
            <span className="font-medium">{hrCount} / {totalHRs}</span>
            <span>{totalHRs} contacts</span>
          </div>
        </div>

        {/* Progress Bar */}
        {sending && (
          <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 border border-emerald-500/20">
            <div className="flex justify-between text-sm items-center">
              <span className="font-medium flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending emails...
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
            <p className="text-xs text-muted-foreground">Please wait while we process your request</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border animate-fade-in">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Delivery Results
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg border border-emerald-500/20 hover:shadow-md transition-shadow">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.sent}</span>
                <span className="text-xs text-muted-foreground font-medium">Sent</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-red-500/10 dark:bg-red-500/20 rounded-lg border border-red-500/20 hover:shadow-md transition-shadow">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mb-2" />
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{result.failed}</span>
                <span className="text-xs text-muted-foreground font-medium">Failed</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/20 hover:shadow-md transition-shadow">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.total}</span>
                <span className="text-xs text-muted-foreground font-medium">Total</span>
              </div>
            </div>
            {result.sent > 0 && (
              <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 mt-2">
                🎉 Your resume has been successfully delivered!
              </p>
            )}
          </div>
        )}

        {/* Demo Mode Notice */}
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Demo Mode:</strong> Emails are simulated for demonstration. 
            Configure EMAIL_USER and EMAIL_PASSWORD in .env to send real emails.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSendToHR}
            disabled={sending || !jobTitle.trim()}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 dark:from-emerald-500 dark:to-blue-500 dark:hover:from-emerald-600 dark:hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            size="lg"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send to {hrCount} HRs
              </>
            )}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={sending} size="lg">
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SendToHR;
