"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

interface ApiOptions extends RequestInit {
  retryOn429?: boolean; // auto retry toggle
}

export function useApiWithRateLimit() {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number | null>(null);

  const callApi = useCallback(
    async (url: string, options: ApiOptions = {}) => {
      if (isCoolingDown) {
        toast.error(`Please wait ${cooldownTime}s before trying again.`);
        return null;
      }

      try {
        const res = await fetch(url, options);

        if (res.status === 429) {
          const data = await res.json();
          const secondsLeft = Math.ceil((data.reset - Date.now()) / 1000);

          setIsCoolingDown(true);
          setCooldownTime(secondsLeft);

          toast.error(`${data.error} Retry in ${secondsLeft}s.`);

          // Decrement countdown visually
          const interval = setInterval(() => {
            setCooldownTime((prev) => {
              if (!prev || prev <= 1) {
                clearInterval(interval);
                setIsCoolingDown(false);
                return null;
              }
              return prev - 1;
            });
          }, 1000);

          return null;
        }

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        return await res.json();
      } catch (err: any) {
        console.error("API call failed:", err.message);
        toast.error("Something went wrong. Please try again.");
        return null;
      }
    },
    [isCoolingDown, cooldownTime]
  );

  return { callApi, isCoolingDown, cooldownTime };
}
