"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Import this
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/custom/UserMenu"; // adjust import path if needed
import { Loader2 } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // ✅ Get current path
  const user = session?.user;

  return (
    <header className="p-3 px-5 flex justify-between items-center bg-white shadow-lg border-b border-gray-100">
      <Link href="/">
  <div className="relative w-[100px] h-10">
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
          <Button disabled>
            <Loader2 className="animate-spin" />
          </Button>
        </div>
      ) : user ? (
        <div className="flex items-center gap-3">
          {pathname === "/dashboard" ? (
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          )}
          <UserMenu user={user} />
        </div>
      ) : (
        <Button className="bg-[#9f5bff]" onClick={() => signIn()}>
          Get Started
        </Button>
      )}
    </header>
  );
}
