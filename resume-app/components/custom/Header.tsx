"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Import this
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/custom/UserMenu"; // adjust import path if needed
import ThemeToggle from "@/components/custom/ThemeToggle";
import { Loader2 } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // ✅ Get current path
  const user = session?.user;

  return (
  <header className="p-2 sm:p-3 px-3 sm:px-5 flex justify-between items-center bg-background/80 dark:bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60 border-b border-border dark:border-border/60 sticky top-0 z-50 shadow-sm dark:shadow-lg">
      <Link href="/">
  <div className="relative w-20 sm:w-[100px] h-8 sm:h-10 transition-transform hover:scale-105">
          <Image
            src="/logo.svg"
            alt="Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </Link>

      {status === "loading" ? (
        <div className="animate-pulse">
          <Button disabled size="sm" className="sm:h-9">
            <Loader2 className="animate-spin h-4 w-4" />
          </Button>
        </div>
      ) : user ? (
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {pathname === "/dashboard" ? (
            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden xs:inline">Home</span>
                <span className="xs:hidden">Home</span>
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden xs:inline">Dashboard</span>
                <span className="xs:hidden">Dashboard</span>
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button 
            className="bg-[#9f5bff] hover:bg-[#8a4ae6] dark:bg-[#a868ff] dark:hover:bg-[#9457e6] shadow-md dark:shadow-primary/30 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9" 
            onClick={() => signIn()}
          >
          <span className="hidden xs:inline">Get Started</span>
          <span className="xs:hidden">Start</span>
          </Button>
        </div>
      )}
    </header>
  );
}
