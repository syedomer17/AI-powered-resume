"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import gsap from "gsap";
import Link from "next/link";

const SignUp = () => {
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          userName: form.userName, // 👈 map name to userName here
          email: form.email,
          password: form.password,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful! Check your email for OTP.");
        router.push("/verify-email?email=" + form.email);
      } else {
        toast.error(data.error || "Signup failed.");
      }
    } catch {
      toast.error("Something went wrong.");
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
              <h1 className="text-2xl font-semibold">Sign Up</h1>
            </div>
            <div className="divide-y divide-gray-200 mt-4">
              <form
                onSubmit={handleSubmit}
                className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                {/* Username */}
                <div className="relative">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    value={form.userName}
                    onChange={handleChange}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                    placeholder="Username"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
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

                {/* Password */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
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
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center py-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-500">
                  Or sign up with
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Social Buttons */}
              <div className="flex flex-col space-y-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    viewBox="0 0 48 48"
                    version="1.1"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path
                        fill="#FBBC05"
                        d="M9.827 24c0-1.524.253-2.985.705-4.356L2.623 13.604A23.97 23.97 0 000.214 24c0 3.737.868 7.261 2.406 10.388l7.904-6.051A14.156 14.156 0 019.827 24"
                      />
                      <path
                        fill="#EB4335"
                        d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.093l6.836-6.827C35.036 2.773 29.695.533 23.714.533c-9.287 0-17.268 5.311-21.09 13.071l7.909 6.04c1.823-5.532 7.017-9.511 13.181-9.511"
                      />
                      <path
                        fill="#34A853"
                        d="M23.714 37.867c-6.165 0-11.36-3.979-13.182-9.511l-7.909 6.039c3.822 7.761 11.804 13.072 21.091 13.072 5.732 0 11.204-2.035 15.311-5.849l-7.508-5.804c-2.118 1.334-4.785 2.052-7.803 2.052"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714v9.067h12.605c-.63 3.091-2.345 5.468-4.8 7.014l7.508 5.804C43.34 37.614 46.145 31.649 46.145 24"
                      />
                    </g>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => signIn("github")}
                  className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.111.82-.258.82-.577v-2.17c-3.338.727-4.033-1.416-4.033-1.416-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.729.083-.729 1.204.086 1.838 1.237 1.838 1.237 1.07 1.834 2.808 1.304 3.495.997.108-.775.42-1.305.763-1.605-2.665-.305-5.467-1.335-5.467-5.934 0-1.311.468-2.382 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.518 11.518 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.242 2.873.118 3.176.77.84 1.234 1.91 1.234 3.221 0 4.61-2.806 5.625-5.479 5.922.431.372.816 1.102.816 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>

                {/* Already have account */}
                <div className="text-center text-sm text-gray-500 pt-4">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-600 hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
