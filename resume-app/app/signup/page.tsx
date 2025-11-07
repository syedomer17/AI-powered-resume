"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import gsap from "gsap";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";

const SignUp = () => {
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { callApi } = useApi();
  const router = useRouter();

  useEffect(() => {
    gsap.set(".form-container", { opacity: 0, y: -60 });
    gsap.to(".form-container", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await callApi("/api/register", {
        method: "POST",
        body: JSON.stringify({
          userName: form.userName,
          email: form.email,
          password: form.password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!data) return;

      if (!data.error) {
        toast.success("Signup successful! Check email for OTP.");
        router.push("/verify-email?email=" + form.email);
      } else {
        toast.error(data.error || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="relative w-full max-w-lg">
        
        {/* Cyan tilted card background (same as login) */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-xl transform sm:-skew-y-3 -rotate-2 rounded-3xl -z-10 scale-[1.08]"></div>

        <div className="relative z-10 bg-white shadow-2xl sm:rounded-3xl py-10 px-6 sm:p-20 form-container">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-black text-always-black">Sign Up</h1>

            <form onSubmit={handleSubmit} className="py-8 space-y-6 text-black">

              {/* Username */}
              <div className="relative">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  value={form.userName}
                  onChange={handleChange}
                  required
                  className="peer w-full h-10 border-b-2 border-gray-300 text-black placeholder-transparent focus:outline-none focus:border-cyan-600 text-always-black"
                  placeholder="Username"
                />
                <label
                  htmlFor="userName"
                  className="absolute left-0 -top-3.5 text-sm text-black transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black text-always-black"
                >
                  Username
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="peer w-full h-10 border-b-2 border-gray-300 text-black placeholder-transparent focus:outline-none focus:border-cyan-600 text-always-black"
                  placeholder="Email Address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-sm text-black transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black text-always-black"
                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="peer w-full h-10 border-b-2 border-gray-300 text-black placeholder-transparent pr-10 focus:outline-none focus:border-cyan-600 text-always-black"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-sm text-black transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black text-always-black"
                >
                  Password
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                </Button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md text-white font-medium transition-all ${
                  loading ? "bg-cyan-300 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
                }`}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            {/* Social Login */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => signIn("google")}
                className="btn-social"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" />
                Continue with Google
              </button>

              <button
                onClick={() => signIn("github")}
                className="btn-social"
              >
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="h-5 w-5 mr-2" />
                Continue with GitHub
              </button>
            </div>

            <div className="pt-4 text-center text-sm text-black">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-600 font-medium hover:underline">
                Log in
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
