"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2, FileText } from "lucide-react";
import SendToHR from "@/components/custom/SendToHR";
import { useApi } from "@/hooks/useApi";

interface HRSendPanelProps {
  resumeId: string;
}

export default function HRSendPanel({ resumeId }: HRSendPanelProps) {
  const { callApi, loading: apiLoading } = useApi();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);

    try {
      const form = new FormData();
      form.append("file", file);
      const data = await callApi("/api/upload-resume", {
        method: "POST",
        body: form,
      });

      if (!data) {
        setUploading(false);
        return;
      }

      if (!data.success) throw new Error(data.message || "Upload failed");
      setUploadedUrl(data.url);
    } catch (err) {
      console.error("Resume upload failed:", err);
      setUploadedUrl(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
              <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Upload Your Resume (PDF)
          </CardTitle>
          <CardDescription className="text-xs">
            Please upload a PDF version of your resume to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Select PDF File</label>
            <Input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              disabled={uploading}
              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-500/20 transition-colors"
            />
          </div>
          {uploading && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20">
              <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Uploading...</span>
            </div>
          )}
          {uploadedUrl ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Upload successful!</p>
                <p className="text-xs text-muted-foreground truncate">{fileName}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Max size depends on Cloudinary plan. PDF format only.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Once uploaded, enable sending */}
      <div className={`transition-all duration-300 ${uploadedUrl ? "opacity-100" : "opacity-50 pointer-events-none blur-sm"}`}>
        <SendToHR resumeId={resumeId} resumePdfUrl={uploadedUrl || undefined} />
      </div>
    </div>
  );
}
