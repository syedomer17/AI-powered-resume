"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { triggerConfetti } from "@/components/firecrackers/ConfettiSideCannons";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";

interface Resume {
  _id?: string;
  id: number;
  title: string;
}

interface ResumeCardItemProps {
  resume: Resume;
  index: number;
}

export default function ResumeCardItem({ resume, index }: ResumeCardItemProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { callApi } = useApiWithRateLimit();
  const [openAlert, setOpenAlert] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!userId) return null;

  const handleDelete = async () => {
    if (!userId || !resume._id) {
      console.error("Missing userId or resumeId");
      return;
    }

    try {
      const data = await callApi(`/api/user/${userId}/resume/${resume._id}`, {
        method: "DELETE",
      });

      if (data) {
        setOpenAlert(false);
        router.refresh();
      } else {
        console.error("Failed to delete resume");
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  const handleDownload = async () => {
    if (!userId || !resume._id) {
      // Fallback: if _id is missing, navigate to view page
      router.push(`/dashboard/resume/${userId}/${resume._id || resume.id}/view`);
      return;
    }

    try {
      setDownloading(true);
      // Use regular fetch for blob downloads (not wrapped in callApi)
      const res = await fetch(`/api/generate-pdf?userId=${userId}&resumeId=${resume._id}`);
      if (!res.ok) throw new Error(`PDF API failed: ${res.status}`);
      const blob = await res.blob();

      const fileNameBase = (resume.title || "resume").toLowerCase().replace(/\s+/g, "-");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileNameBase}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Trigger confetti celebration on successful download
      triggerConfetti();
    } catch (e) {
      console.error("Failed to download PDF:", e);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <>
      <div className="relative group w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50">
        {/* Dropdown Trigger (Top-right) */}
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/80 transition backdrop-blur-sm bg-white/60 dark:bg-slate-800/60 shadow-sm">
                <MoreVertical className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/resume/${userId}/${resume.id}/edit`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/resume/${userId}/${resume._id}/view`)
                }
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} disabled={downloading}>
                {downloading ? "Downloading..." : "Download"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setOpenAlert(true)}
                className="text-red-500 dark:text-red-400"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link
          href={`/dashboard/resume/${userId}/${resume.id}/edit`}
          className="block h-full flex flex-col items-center justify-center p-6 text-center"
        >
          {/* Resume Icon */}
          <div className="w-20 h-20 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Image src="/cv.png" width={48} height={48} alt="Resume Icon" className="w-12 h-12 drop-shadow-lg" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 mb-2">
            {resume.title || "Untitled Resume"}
          </h3>
          
          {/* Subtitle */}
          <p className="text-xs text-white opacity-60">Click to edit</p>
        </Link>
      </div>

      {/* AlertDialog placed outside the dropdown */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete your
              resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
