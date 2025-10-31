"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Search, LogOut, BarChart2 } from "lucide-react";

export default function UserMenu({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    login?: string | null;
    id?: string | null; // Add user ID
  };
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  
  const userId = user.id || session?.user?.id;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fallbackImage =
    "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        <Image
          src={user.image || fallbackImage}
          alt={
            user.login
              ? `${user.login}'s avatar`
              : user.name
              ? `${user.name}'s avatar`
              : "User avatar"
          }
          width={40}
          height={40}
          className="rounded-full border"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-4 border-b">
            <p className="font-semibold">
              {user.login ?? user.name ?? "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.email ?? "No email"}
            </p>
          </div>
          
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            {userId && (
              <>
                <Link
                  href={`/dashboard/hr-contacts/${userId}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>HR Contacts</span>
                </Link>
                <Link
                  href={`/dashboard/ats`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>ATS Checker</span>
                </Link>
                
                <Link
                  href={`/dashboard/jobs/${userId}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Jobs</span>
                </Link>
              </>
            )}
          </div>
          
          <div className="border-t">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
