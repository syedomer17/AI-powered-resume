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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddResume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCreateResume = async () => {
    if (!title.trim() || !session?.user) return;

    try {
      setLoading(true);

      // ✅ Prepare payload
      const payload = {
        title: title.trim(),
        userEmail: session.user.email || "",
        userName: session.user.name || "",
        // Assuming you stored the MongoDB _id in user.id:
        userId: session.user.id, 
      };

      // ✅ Axios call
      const res = await axios.post("/api/resume", payload);

      const { data } = res;

      if (!data?.data?.resume) {
        throw new Error("Resume creation failed.");
      }

      // Get the id
      const resumeId = data.data.resume.id;

      setOpenDialog(false);
      setTitle("");

      router.push(`/dashboard/resume/${resumeId}/edit`);
    } catch (err) {
      console.error("Failed to create resume:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add New Resume Button */}
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
              <p className="mb-2">Add a title for your new resume</p>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Full Stack Developer"
                disabled={loading}
              />
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
                  title.trim().length === 0 ||
                  status === "loading" ||
                  !session?.user
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
