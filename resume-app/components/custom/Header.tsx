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
    <header className="relative p-3 sm:p-4 px-4 sm:px-8 flex justify-between items-center bg-gradient-to-r from-background/70 via-background/80 to-background/70 dark:from-background/90 dark:via-background/95 dark:to-background/90 backdrop-blur-xl supports-backdrop-filter:bg-background/60 border-b border-border/50 dark:border-border/30 sticky top-0 z-50 shadow-lg dark:shadow-2xl dark:shadow-purple-500/10">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <Link href="/">
        <div className="group flex items-center gap-2 transition-all duration-300 hover:scale-105">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg border border-blue-200/30 dark:border-purple-500/30">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <TextType
            text={["AI Resume", "CV Maker", "HireAI"]}
            typingSpeed={45}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent"
          />
        </div>
      </Link>

      {status === "loading" ? (
        <div className="animate-pulse">
          <Button disabled size="sm" className="sm:h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-300/30">
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
                className="text-xs sm:text-sm px-3 sm:px-5 h-9 sm:h-10 border-purple-300/30 dark:border-purple-500/30 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-purple-400/50 transition-all duration-300 font-semibold"
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
                className="text-xs sm:text-sm px-3 sm:px-5 h-9 sm:h-10 border-purple-300/30 dark:border-purple-500/30 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-purple-400/50 transition-all duration-300 font-semibold"
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
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50 text-xs sm:text-sm px-4 sm:px-6 h-9 sm:h-10 font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
            onClick={() => signIn()}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Get Started</span>
            <span className="xs:hidden">Start</span>
          </Button>
        </div>
      )}
    </header>
  );
}
