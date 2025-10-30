"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Mail, Send, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface SendToHRProps {
  resumeId: string;
  resumePdfUrl?: string; // optional uploaded resume link
  onClose?: () => void;
}

const SendToHR = ({ resumeId, resumePdfUrl, onClose }: SendToHRProps) => {
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
      const response = await axios.get("/api/jobs/send-to-hr");
      if (response.data.success) {
        setTotalHRs(response.data.data.totalHRContacts);
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
      const response = await axios.post("/api/jobs/send-to-hr", {
        resumeId,
        jobTitle,
        hrCount,
        resumePdfUrl,
      });

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Send Resume to HR
        </CardTitle>
        <CardDescription>
          Automatically send your resume to {totalHRs} HR contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Title</label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Software Developer, Product Manager"
            disabled={sending}
          />
          <p className="text-xs text-gray-500">
            This will be used in the email subject line
          </p>
        </div>

        {/* HR Count Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Number of HR Contacts: {hrCount}
          </label>
          <input
            type="range"
            min="10"
            max={totalHRs}
            step="10"
            value={hrCount}
            onChange={(e) => setHRCount(parseInt(e.target.value))}
            disabled={sending}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Send to {hrCount} out of {totalHRs} available HR contacts
          </p>
        </div>

        {/* Progress Bar */}
        {sending && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sending emails...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Results:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-lg font-bold">{result.sent}</span>
                <span className="text-xs text-gray-500">Sent</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <XCircle className="w-5 h-5 text-red-500 mb-1" />
                <span className="text-lg font-bold">{result.failed}</span>
                <span className="text-xs text-gray-500">Failed</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <Mail className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-lg font-bold">{result.total}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-800">
            <strong>Demo Mode:</strong> Emails are simulated for demonstration. 
            Configure EMAIL_USER and EMAIL_PASSWORD in .env to send real emails.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSendToHR}
            disabled={sending || !jobTitle.trim()}
            className="flex-1"
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
            <Button variant="outline" onClick={onClose} disabled={sending}>
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SendToHR;
