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

  if (!userId) return null; // or loading

  return (
    <Link href={`/dashboard/resume/${userId}/${resume.id}/edit`} className="block w-64">
      <div className="p-10 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 flex justify-center items-center h-[280px] border-t-4 border-[#9f5bff] rounded-lg hover:scale-105 transition-all hover:drop-shadow-[0_0_10px_#9f5bff]">
        <Image src="/cv.png" width={120} height={120} alt="Resume icon" />
      </div>
      <h2 className="text-center my-2 font-medium">{resume.title}</h2>
    </Link>
  );
}
