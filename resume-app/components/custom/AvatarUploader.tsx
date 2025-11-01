"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type AvatarUploaderProps = {
  value?: string;
  onUploaded?: (url: string) => void;
};

export default function AvatarUploader({ value, onUploaded }: AvatarUploaderProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [loading, setLoading] = useState(false);

  const openPicker = () => fileRef.current?.click();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Please select a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Image must be less than 3MB.");
      return;
    }

    setLoading(true);
    try {
      // Read as base64 (required by /api/user/avatar)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: base64 }),
      });
      const data = await res.json();
  if (!res.ok || !data.imageUrl) throw new Error(data.message || "Upload failed");

  setPreview(data.imageUrl);
  onUploaded?.(data.imageUrl);
    } catch (err: any) {
      alert(err.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <Button 
        type="button" 
        onClick={openPicker} 
        disabled={loading} 
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Change Avatar
          </>
        )}
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
        PNG, JPG or WEBP (max. 3MB)
      </p>
    </div>
  );
}
