"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FileQuestion className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
                404
              </h1>
              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Search className="w-16 h-16 sm:w-20 sm:h-20 text-purple-600 dark:text-purple-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Oops! Page Not Found
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The page you're looking for seems to have taken a coffee break ☕
              <br />
              Don't worry, we'll help you find your way back!
            </p>
          </motion.div>

          {/* Animated Card with Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="font-semibold text-foreground">Go Home</h3>
                <p className="text-sm text-muted-foreground">
                  Return to safety
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold text-foreground">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Check your resumes
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold text-foreground">Search</h3>
                <p className="text-sm text-muted-foreground">
                  Find what you need
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Back to Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 hover:bg-accent hover:border-blue-500/50 dark:hover:border-purple-500/50 transition-all duration-300 w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 text-4xl opacity-50"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute top-40 right-20 text-4xl opacity-50"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              🚀
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-20 text-4xl opacity-50"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              💼
            </motion.div>
            <motion.div
              className="absolute bottom-40 right-10 text-4xl opacity-50"
              animate={{
                y: [0, 15, 0],
                rotate: [0, -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              📄
            </motion.div>
          </div>

          {/* Error Code */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-sm text-muted-foreground"
          >
            Error Code: 404 • Page Not Found
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
