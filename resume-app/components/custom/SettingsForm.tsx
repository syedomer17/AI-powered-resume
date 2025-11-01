"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarUploader from "./AvatarUploader";

type SettingsFormProps = {
  initialUser: {
    userName: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
};

export default function SettingsForm({ initialUser }: SettingsFormProps) {
  const [userName, setUserName] = useState(initialUser.userName || "");
  const [avatar, setAvatar] = useState(initialUser.avatar || "");
  const [bio, setBio] = useState(initialUser.bio || "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, avatar, bio }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update profile");
      // Optional: toast library could be used; fallback to alert
      alert("Profile updated successfully");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const initials = (userName || initialUser.email)
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {avatar ? <AvatarImage src={avatar} alt="avatar" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-neutral-500">Signed in as</p>
            <p className="font-medium">{initialUser.email}</p>
          </div>
        </div>
        <AvatarUploader value={avatar} onUploaded={(url) => setAvatar(url)} />
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">User name</label>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about you"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
          <Input value={initialUser.email} disabled />
          <p className="mt-1 text-xs text-neutral-500">Email cannot be changed.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
