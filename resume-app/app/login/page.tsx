"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import gsap from "gsap";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="relative w-full max-w-lg">

        {/* Gradient background behind */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-xl transform sm:-skew-y-3 -rotate-2 rounded-3xl -z-10 scale-[1.08]"></div>

        {/* White form card */}
        <div className="relative z-10 bg-white !bg-opacity-100 shadow-2xl sm:rounded-3xl py-10 px-6 sm:p-20 form-container">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-black text-always-black">Login</h1>

            <form onSubmit={handleLogin} className="py-8 space-y-6 text-gray-700">

              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="peer w-full h-10 border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-600"
                  placeholder="Email Address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-700"
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
                  className="peer w-full h-10 border-b-2 border-gray-300 text-gray-900 placeholder-transparent pr-10
                  focus:outline-none focus:border-cyan-600"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-700"
                >
                  Password
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                </Button>
              </div>

              <div className="text-right">
                <Link href="/forgot-password/request" className="text-sm text-cyan-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md text-white font-medium transition-all ${
                  loading ? "bg-cyan-300 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
                }`}
              >
                {loading ? "Logging in..." : "Submit"}
              </button>
            </form>

            {/* Social login buttons */}
            <div className="pt-6 space-y-3">

              {/* Google */}
              <button
                onClick={() => signIn("google")}
                className="btn-social text-always-black"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2"/>
                Continue with Google
              </button>

              {/* GitHub */}
              <button
                onClick={() => signIn("github")}
                className="btn-social text-always-black"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  className="h-5 w-5 mr-2"
                  alt="GitHub"
                />
                Continue with GitHub
              </button>

            </div>

            <div className="pt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-cyan-600 font-medium hover:underline">
                Sign up
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
