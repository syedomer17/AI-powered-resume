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
  const [openAlert, setOpenAlert] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!userId) return null;

  const handleDelete = async () => {
    if (!userId || !resume._id) {
      console.error("Missing userId or resumeId");
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}/resume/${resume._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOpenAlert(false);
        router.refresh();
      } else {
        const data = await res.json();
        console.error("Failed to delete resume:", data?.message);
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
    } catch (e) {
      console.error("Failed to download PDF:", e);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <>
      <div className="relative group w-full bg-white dark:bg-card rounded-2xl shadow-lg dark:shadow-xl overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl dark:hover:shadow-2xl border border-gray-200 dark:border-border/60 hover:border-[#9f5bff] dark:hover:border-primary">
        {/* Gradient Top Banner */}
        <div className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 dark:from-primary/80 dark:via-purple-500 dark:to-blue-500 h-20 sm:h-24 w-full"></div>

        {/* Dropdown Trigger (Top-right) */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-accent transition backdrop-blur-sm bg-white/80 dark:bg-card/80">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-foreground hover:text-[#9f5bff] dark:hover:text-primary" />
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
          className="block pt-12 sm:pt-16 pb-5 sm:pb-6 px-3 sm:px-4 text-center"
        >
          <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-card rounded-full shadow-md dark:shadow-lg flex items-center justify-center group-hover:scale-105 transition border-2 border-white dark:border-border/40">
            <Image src="/cv.png" width={50} height={50} alt="Resume Icon" className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-foreground group-hover:text-[#9f5bff] dark:group-hover:text-primary transition mt-4 sm:mt-6 line-clamp-2">
            {resume.title || "Untitled Resume"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">Click to edit</p>
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
