"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2, FileText } from "lucide-react";
import SendToHR from "@/components/custom/SendToHR";

interface HRSendPanelProps {
  resumeId: string;
}

export default function HRSendPanel({ resumeId }: HRSendPanelProps) {
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
      const res = await fetch("/api/upload-resume", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" /> Upload Your Resume (PDF)
          </CardTitle>
          <CardDescription>
            Please upload a PDF version of your resume to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input type="file" accept="application/pdf" onChange={handleFileChange} disabled={uploading} />
            <Button variant="outline" disabled>
              {uploading ? "Uploading..." : "PDF only"}
            </Button>
          </div>
          {uploadedUrl ? (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Uploaded: {fileName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileText className="w-4 h-4" />
              <span>Max size depends on Cloudinary plan. Ensure it is a PDF.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Once uploaded, enable sending */}
      <div className={uploadedUrl ? "opacity-100" : "opacity-60 pointer-events-none"}>
        <SendToHR resumeId={resumeId} resumePdfUrl={uploadedUrl || undefined} />
      </div>
    </div>
  );
}
