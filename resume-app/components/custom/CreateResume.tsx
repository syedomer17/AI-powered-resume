"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useApi } from "@/hooks/useApi";

export default function CreateResume({ userId, userEmail }: { userId?: string; userEmail?: string }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { callApi, loading: apiLoading } = useApi();
  const router = useRouter();

  const handleCreateResume = async () => {
    if (!title) return toast.error("Please enter a title.");
    setLoading(true);

    try {
      const data = await callApi("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          userId,
          userEmail,
        }),
      });

      if (!data) {
        setLoading(false);
        return;
      }

      if (!data.data) {
        toast.error(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      toast.success("Resume created!");

      const resumeId = data.data.resume._id;
      const index = data.data.resume.id;

      router.push(`/dashboard/resume/${resumeId}/${index}/edit`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 my-6">
      <Input
        type="text"
        placeholder="Enter resume title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-72"
      />
      <Button onClick={handleCreateResume} disabled={loading}>
        {loading ? "Creating..." : "Add Resume"}
      </Button>
    </div>
  );
}
