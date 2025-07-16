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
  return (
    <>
      <div className="relative group w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl border border-gray-200 hover:border-[#9f5bff]">
        {/* Gradient Top Banner */}
        <div className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 h-24 w-full"></div>

        {/* Dropdown Trigger (Top-right) */}
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-100 transition">
                <MoreVertical className="h-5 w-5 text-gray-600 hover:text-[#9f5bff]" />
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
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setOpenAlert(true)}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link
          href={`/dashboard/resume/${userId}/${resume.id}/edit`}
          className="block pt-16 pb-6 px-4 text-center"
        >
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center group-hover:scale-105 transition">
            <Image src="/cv.png" width={50} height={50} alt="Resume Icon" />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#9f5bff] transition mt-6">
            {resume.title || "Untitled Resume"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Click to edit</p>
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
