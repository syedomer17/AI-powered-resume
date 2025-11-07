"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ApiOptions extends RequestInit {
  // Standard fetch options without rate limiting
}

export function useApi() {
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(
    async (url: string, options: ApiOptions = {}) => {
      setLoading(true);
      
      try {
        const res = await fetch(url, options);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Request failed' }));
          toast.error(errorData.error || `Request failed with status ${res.status}`);
          return null;
        }

        const data = await res.json();
        return data;
      } catch (err: any) {
        console.error("API call failed:", err.message);
        toast.error("Something went wrong. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { callApi, loading };
}