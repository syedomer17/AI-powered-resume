"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <button
        onClick={() => signIn("github")}
        className="bg-gray-900 text-white px-6 py-2 rounded mb-2"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => signIn("google")}
        className="bg-red-500 text-white px-6 py-2 rounded"
      >
        Sign in with Google
      </button>
    </main>
  );
}
