"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function UserMenu({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    login?: string | null; // ✅ Add login
  };
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
