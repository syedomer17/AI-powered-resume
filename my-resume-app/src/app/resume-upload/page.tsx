"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function ResumeUploadPage() {
  const { session, status } = useAuth();
  const [content, setContent] = useState("");
  const [jobType, setJobType] = useState<"intern" | "full-time" | "part-time">("full-time");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUpload = async () => {
    if (!content.trim() && !file) {
      setMessage("Please enter resume text or upload a file.");
      return;
    }

    setLoading(true);
    setMessage("");

    let fileUrl = "";

    try {
      // 1️⃣ If file is selected, upload to Cloudinary
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data?.url) throw new Error("File upload failed.");
        fileUrl = data.url;
        setUploadedUrl(fileUrl);
      }

      // 2️⃣ Save to your database
      await fetch("/api/resume/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.email,
          content,
          fileUrl,
          jobType,
        }),
      });

      setMessage("Resume saved successfully!");
      setContent("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    }

    setLoading(false);
  };

  if (status === "loading") return <div className="p-4">Loading...</div>;

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your resume text..."
        rows={8}
        className="w-full border p-2 mb-4"
      />

      <div className="mb-4">
        <label className="block font-semibold mb-1">Or upload a file:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Job Type:</label>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value as any)}
          className="border p-1"
        >
          <option value="intern">Intern</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-2">{message}</p>}

      {uploadedUrl && (
        <div className="mt-2">
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Uploaded File
          </a>
        </div>
      )}
    </main>
  );
}
