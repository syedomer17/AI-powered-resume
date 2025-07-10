"use client";

import { Notebook } from "lucide-react";
import Link from "next/link";

interface Resume {
  _id: string;
  title: string;
  userName?: string; // removed or optional
}

export default function ResumeCardItem({ resume }: { resume: Resume }) {
  return (
    <Link
      href={`/dashboard/resume/${resume._id}/edit`}
      className="cursor-pointer select-none block"
    >
      <div className="p-14 bg-secondary flex justify-center items-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md">
        <Notebook className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-center my-2 font-medium">{resume.title}</h2>
    </Link>
  );
}
