"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarUploader from "./AvatarUploader";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";
import { useSession } from "next-auth/react";

type SettingsFormProps = {
  initialUser: {
    userName: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
};

export default function SettingsForm({ initialUser }: SettingsFormProps) {
  const { callApi } = useApiWithRateLimit();
  const { data: session, update } = useSession();
  const [userName, setUserName] = useState(initialUser.userName || "");
  const [avatar, setAvatar] = useState(initialUser.avatar || "");
  const [bio, setBio] = useState(initialUser.bio || "");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    try {
      const data = await callApi("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, avatar, bio }),
      });

      if (!data) {
        setLoading(false);
        return;
      }

      if (!data.success) throw new Error(data.message || "Failed to update profile");
      
      // Update the session - this will trigger a fresh fetch from database
      await update();
      
      setNotification({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Something went wrong" });
      setTimeout(() => setNotification(null), 5000);
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
  <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg border-l-4 flex items-start gap-3 animate-in slide-in-from-top-5 ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-500 dark:border-green-500/50"
              : "bg-red-50 dark:bg-red-950/30 border-red-500 dark:border-red-500/50"
          }`}
        >
          <div className="shrink-0">
            {notification.type === "success" ? (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className={`shrink-0 ${
              notification.type === "success"
                ? "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                : "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-card dark:bg-card/80 backdrop-blur-sm text-card-foreground p-4 sm:p-6 md:p-8 rounded-xl border border-border dark:border-border/60 shadow-sm dark:shadow-lg transition-all">
        <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-border dark:border-border/60">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
              Update your profile details and avatar
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-muted/30 dark:bg-muted/20 p-4 sm:p-6 rounded-lg border border-border/50 dark:border-border/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-background dark:ring-card shadow-md">
                {avatar ? <AvatarImage src={avatar} alt="avatar" /> : null}
                <AvatarFallback className="text-lg sm:text-xl font-semibold bg-primary/10 text-primary dark:bg-primary/20">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground dark:text-muted-foreground/80 mb-1">
                  Signed in as
                </p>
                <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {initialUser.email}
                </p>
                <div className="mt-3">
                  <AvatarUploader value={avatar} onUploaded={(url) => setAvatar(url)} />
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-foreground/90 mb-2">
                User name
              </label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                required
                className="h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-foreground/90 mb-2">
                Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself..."
                rows={4}
                className="resize-none"
              />
              <p className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground/70">
                Brief description for your profile. Max 500 characters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-foreground/90 mb-2">
                Email address
              </label>
              <Input 
                value={initialUser.email} 
                disabled 
                className="h-11 bg-muted/50 dark:bg-muted/30 cursor-not-allowed" 
              />
              <p className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground/70 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Email cannot be changed for security reasons.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border dark:border-border/60">
            <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 shadow-md dark:shadow-primary/30 w-full sm:w-auto min-w-[140px]"
              size="lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
