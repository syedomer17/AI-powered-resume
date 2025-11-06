"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = (mounted ? (resolvedTheme ?? theme) : "light") === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="
        relative w-10 h-10 grid place-items-center rounded-md border 
        bg-white dark:bg-black border-gray-200 dark:border-gray-700
        focus-visible:ring-2 focus-visible:ring-primary
      "
    >
      <Sun
        className={`h-5 w-5 transition-transform ${
          isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"
        } text-black dark:text-white`}
      />
      <Moon
        className={`h-5 w-5 absolute transition-transform ${
          isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        } text-black dark:text-white`}
      />
    </button>
  );
}
