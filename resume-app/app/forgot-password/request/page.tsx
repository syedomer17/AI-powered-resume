"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import gsap from "gsap";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";

export default function RequestOtpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { callApi } = useApiWithRateLimit();
  const router = useRouter();

  useEffect(() => {
    gsap.set(".form-container", { opacity: 0, y: -100 });
    gsap.to(".form-container", {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await callApi("/api/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!data) {
        setLoading(false);
        return;
      }

      if (!data.error) {
        toast.success("OTP sent to your email.");
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto form-container">
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />

        {/* Card */}
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Forgot Password</h1>
            </div>
            <div className="divide-y divide-gray-200 mt-4">
              <form
                onSubmit={handleSubmit}
                className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                {/* Email */}
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>

                {/* Submit */}
                <div className="relative">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      loading
                        ? "bg-indigo-300 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    } text-white rounded-md px-4 py-2 w-full`}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              </form>

              {/* Info Text */}
              <div className="text-sm text-gray-500 pt-4 text-center">
                We’ll email you a One-Time Password to reset your password.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
