import Header from "@/components/custom/Header";
import { AtomIcon, Edit, Share2, Sparkles, FileText, Zap, CheckCircle, TrendingUp, Users } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200/50 dark:border-blue-800/50 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI-Powered Resume Builder
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="text-foreground">Build Your Perfect</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
                Resume With AI
              </span>
            </h1>
            
            <p className="mb-8 sm:mb-10 text-lg sm:text-xl font-normal text-muted-foreground max-w-3xl mx-auto px-4">
              Create professional, ATS-optimized resumes in minutes with our intelligent AI assistant. Stand out and land your dream job.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/dashboard/ats"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground bg-background border-2 border-border hover:border-primary/50 rounded-xl hover:bg-muted/50 transition-all duration-300 active:scale-[0.98] w-full sm:w-auto"
              >
                <FileText className="w-5 h-5 mr-2" />
                Try ATS Checker
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">10K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Resumes Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">5K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Happy Users</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 sm:py-20 px-4 mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your professional resume in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <AtomIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  AI-Powered Generation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Leverage advanced AI to create tailored resume content based on your experience, skills, and career goals
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Edit className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Easy Customization
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fine-tune every detail with our intuitive editor. Add, remove, or modify sections to perfectly match your style
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Share2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Export & Share
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download your resume as PDF or share it directly with recruiters. Multiple format options available
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 px-4 mx-auto max-w-7xl bg-gradient-to-b from-muted/30 to-background">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">HireAI</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI-powered platform helps you create professional resumes that get noticed by recruiters and pass ATS systems.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">ATS-Optimized</h4>
                    <p className="text-sm text-muted-foreground">Pass applicant tracking systems with optimized formatting and keywords</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Lightning Fast</h4>
                    <p className="text-sm text-muted-foreground">Create professional resumes in minutes, not hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Career Growth</h4>
                    <p className="text-sm text-muted-foreground">Get insights and suggestions to improve your career trajectory</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/50 rounded w-full"></div>
                  <div className="h-4 bg-muted/50 rounded w-5/6"></div>
                  <div className="h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mt-6"></div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-16 bg-muted/50 rounded-lg"></div>
                    <div className="h-16 bg-muted/50 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-4 mx-auto max-w-7xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of job seekers who have successfully landed their dream jobs
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started for Free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
