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
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 rounded-full overflow-hidden bg-neutral-200 ring-1 ring-black/5">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="avatar" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div>
        <Button type="button" onClick={openPicker} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? "Uploading..." : "Upload Avatar"}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    </div>
  );
}
