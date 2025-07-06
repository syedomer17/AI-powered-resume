"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session, status } = useSession();

  const user = session?.user;

  return (
    <header className="p-3 px-5 flex justify-between items-center shadow-md">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={40}
          className="cursor-pointer"
        />
      </Link>

      {status === "loading" ? (
        <div className="animate-pulse">
          <Button disabled>Loading...</Button>
        </div>
      ) : user ? (
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={user.image || "/default-avatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button className="bg-[#9f5bff]" onClick={() => signIn()}>
          Get Started
        </Button>
      )}
    </header>
  );
}
