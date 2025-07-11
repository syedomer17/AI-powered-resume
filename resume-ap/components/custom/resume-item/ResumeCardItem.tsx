"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Resume {
  _id?: string;
  id: number;
  title: string;
}

export default function ResumeCardItem({ resume }: { resume: Resume }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) return null;

  return (
    <Link
      href={`/dashboard/resume/${userId}/${resume.id}/edit`}
      className="relative group w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl border border-gray-200 hover:border-[#9f5bff]"
    >
      {/* Gradient Top Banner */}
      <div className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 h-24 w-full"></div>

      {/* Icon */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center group-hover:scale-105 transition">
        <Image src="/cv.png" width={50} height={50} alt="Resume Icon" />
      </div>

      {/* Content */}
      <div className="pt-20 pb-6 px-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#9f5bff] transition">
          {resume.title || "Untitled Resume"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">Click to edit</p>
      </div>
    </Link>
  );
}
