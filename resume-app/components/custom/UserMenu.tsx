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
  
  // Use session data directly for real-time updates
  const currentUser = session?.user || user;
  const userId = currentUser.id;

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
        className="focus:outline-none ring-2 ring-transparent hover:ring-primary/30 rounded-full transition-all"
      >
        <Image
          src={currentUser.image || fallbackImage}
          alt={
            currentUser.login
              ? `${currentUser.login}'s avatar`
              : currentUser.name
              ? `${currentUser.name}'s avatar`
              : "User avatar"
          }
          width={40}
          height={40}
          className="rounded-full border border-border dark:border-border/60 w-8 h-8 sm:w-10 sm:h-10"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-card text-card-foreground border border-border rounded-md shadow-lg dark:shadow-xl z-60 backdrop-blur-sm">
          <div className="p-3 sm:p-4 border-b border-border">
            <p className="font-semibold text-sm sm:text-base truncate">
              {currentUser.login ?? currentUser.name ?? "Anonymous"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {currentUser.email ?? "No email"}
            </p>
          </div>
          
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            {userId && (
              <>
                <Link
                  href={`/dashboard/hr-contacts/${userId}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>HR Contacts</span>
                </Link>
                <Link
                  href={`/dashboard/ats`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>ATS Checker</span>
                </Link>
                
                <Link
                  href={`/dashboard/jobs/${userId}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Jobs</span>
                </Link>
              </>
            )}
          </div>
          
          <div className="border-t border-border">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 hover:bg-accent transition-colors text-red-600 dark:text-red-400 text-sm rounded-b-md"
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
