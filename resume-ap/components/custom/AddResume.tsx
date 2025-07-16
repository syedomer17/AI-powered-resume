"use client";

import { Loader2, PlusSquare } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AddResumeProps {
  userId: string;
  userEmail: string;
}

const AddResume = ({ userId, userEmail }: AddResumeProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("Full Stack Developer");
  const [customTitle, setCustomTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateResume = async () => {
    const finalTitle =
      selectedTitle === "Custom" ? customTitle.trim() : selectedTitle;

    if (!finalTitle) return;

    try {
      setLoading(true);

      const payload = {
        title: finalTitle,
        userEmail: userEmail,
        userName: session?.user?.name || "",
        userId: userId,
      };

      const res = await axios.post("/api/resume", payload);

      const createdResume = res?.data?.data?.resume;
      if (!createdResume) throw new Error("Resume creation failed.");

      const resumeIndex = createdResume.id;

      setOpenDialog(false);
      setCustomTitle("");
      setSelectedTitle("Full Stack Developer");

      router.push(`/dashboard/resume/${userId}/${resumeIndex}/edit`);
    } catch (err) {
      console.error("Failed to create resume:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add Resume Button */}
      <div
        onClick={() => setOpenDialog(true)}
        className="p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dotted"
      >
        <PlusSquare />
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p className="mb-2">Select a title for your new resume</p>

              {/* Select Dropdown */}
              <Select
                value={selectedTitle}
                onValueChange={(value) => setSelectedTitle(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom Title Input */}
              {selectedTitle === "Custom" && (
                <Input
                  className="mt-3"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter your custom title"
                  disabled={loading}
                />
              )}
            </DialogDescription>

            <div className="flex justify-end gap-5 mt-4">
              <Button
                onClick={() => setOpenDialog(false)}
                variant="ghost"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#9f5bff]"
                onClick={handleCreateResume}
                disabled={
                  loading ||
                  (selectedTitle === "Custom" && customTitle.trim().length === 0)
                }
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
