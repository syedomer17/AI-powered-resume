"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function UserMenu({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={
            user.image ||
            "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8"
          }
          alt={user.name ? `${user.name}'s avatar` : "User avatar"}
          className="w-10 h-10 rounded-full border"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-4">
            <p className="font-semibold">{user.name || "Anonymous"}</p>
            <p className="text-sm text-gray-500 truncate">
              {user.email || "No email"}
            </p>
          </div>
          <div className="border-t border-gray-200"></div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
