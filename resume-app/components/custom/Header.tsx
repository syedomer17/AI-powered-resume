"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/custom/UserMenu";
import ThemeToggle from "@/components/custom/ThemeToggle";
import { Loader2, Sparkles } from "lucide-react";
import TextType from "../reactbits/TextType";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  return (
    <header className="relative p-3 sm:p-4 px-4 sm:px-8 flex justify-between items-center bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/90 border-b border-border sticky top-0 z-50 shadow-sm">
      {/* Subtle accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

      <Link href="/">
        <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-105">
          <div className="relative">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative px-3 py-1.5 bg-slate-800 dark:bg-slate-800 rounded-lg border border-slate-700 dark:border-slate-700">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-black dark:text-white">
            <TextType
              text={["AI Resume", "CV Maker", "HireAI"]}
              typingSpeed={45}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className=""
            />
          </div>
        </div>
      </Link>

      {status === "loading" ? (
        <div className="animate-pulse">
          <Button
            disabled
            size="sm"
            className="sm:h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-300/30"
          >
            <Loader2 className="animate-spin h-4 w-4" />
          </Button>
        </div>
      ) : user ? (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {pathname === "/dashboard" ? (
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm px-3 sm:px-5 h-9 sm:h-10 border-slate-200 dark:border-slate-700 hover:bg-slate-50  hover:border-slate-300  transition-all duration-300 font-semibold text-black dark:text-white"
              >
                <span className="hidden xs:inline">Home</span>
                <span className="xs:hidden">Home</span>
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm px-3 sm:px-5 h-9 sm:h-10 border-slate-200 dark:border-slate-700 hover:bg-slate-50  hover:border-slate-300  transition-all duration-300 font-semibold text-black dark:text-white"
              >
                <span className="hidden xs:inline">Dashboard</span>
                <span className="xs:hidden">Dashboard</span>
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button
            onClick={() => signIn()}
            className="btn-start-invert shadow-lg text-xs sm:text-sm px-4 sm:px-6 h-9 sm:h-10 font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden xs:inline">Get Started</span>
            <span className="xs:hidden">Start</span>
          </Button>
        </div>
      )}
    </header>
  );
}
