"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import { useApiWithRateLimit } from "@/hooks/useApiWithRateLimit";

function VerifyEmailForm() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { callApi } = useApiWithRateLimit();

  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);

  // Animate on mount
  useEffect(() => {
    gsap.set(".form-container", { opacity: 0, y: -80 });
    gsap.to(".form-container", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    });
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    const data = await callApi("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp: enteredOtp }),
      headers: { "Content-Type": "application/json" },
    });

    if (!data) return;

    if (!data.error) {
      toast.success("Email verified successfully!");
      router.push("/login");
    } else {
      toast.error(data.error || "Verification failed.");
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);

    try {
      const data = await callApi("/api/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!data) {
        setResending(false);
        return;
      }

      if (!data.error) {
        toast.success("OTP resent successfully.");
        setOtp(Array(6).fill(""));
        setCountdown(60);
        inputsRef.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Server error.");
    } finally {
      setResending(false);
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
            <h1 className="text-2xl font-semibold mb-2 text-center">
              Verify Your Email
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-medium">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={resending}
                className={`w-full py-3 rounded-md text-white font-semibold transition cursor-pointer ${
                  resending
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                Verify
              </button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {countdown > 0 ? (
                <p>
                  Resend OTP in{" "}
                  <span className="font-semibold">{countdown}s</span>
                </p>
              ) : (
                <button
                  disabled={resending}
                  onClick={handleResend}
                  className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
