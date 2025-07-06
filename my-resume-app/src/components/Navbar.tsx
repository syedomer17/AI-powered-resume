"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react"; // Optional: npm install lucide-react

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-blue-600 dark:text-blue-400">
          ResumeApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
          {session ? (
            <div className="flex items-center space-x-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <NavLinks />
          {session ? (
            <div className="flex items-center space-x-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded inline-block"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLinks() {
  return (
    <>
      <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
        Dashboard
      </Link>
      <Link href="/ats-checker" className="hover:text-blue-600 dark:hover:text-blue-400">
        ATS Checker
      </Link>
      <Link href="/resume-builder" className="hover:text-blue-600 dark:hover:text-blue-400">
        AI Builder
      </Link>
      <Link href="/resume-upload" className="hover:text-blue-600 dark:hover:text-blue-400">
        Upload
      </Link>
      <Link href="/resume-submission" className="hover:text-blue-600 dark:hover:text-blue-400">
        Submit
      </Link>
    </>
  );
}
