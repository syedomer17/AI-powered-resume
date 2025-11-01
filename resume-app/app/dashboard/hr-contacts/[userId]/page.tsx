import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Header from "@/components/custom/Header";
import HRSendPanel from "@/components/custom/HRSendPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategorizedHREmails, getTotalHRCount } from "@/data/hrEmails";
import { Mail, Building2, Users, Send, AlertCircle, FileText } from "lucide-react";
import mongoose from "mongoose";

interface HRPageParams {
  params: Promise<{
    userId: string;
  }>;
}

export default async function HRContactsPage({ params }: HRPageParams) {
  const { userId } = await params;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    notFound();
  }

  // Check user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    notFound();
  }

  // Optional: enforce that session user id matches URL userId
  if (session.user.id !== userId) {
    notFound();
  }

  await connectToDB();

  // Find user by _id
  const user = await User.findById(userId);
  if (!user) {
    notFound();
  }

  // Get the first resume ID if available
  const firstResumeId = user.resumes.length > 0 ? user.resumes[0]._id.toString() : undefined;

  const totalHRCount = getTotalHRCount();
  const categoryCount = Object.keys(getCategorizedHREmails()).length;

  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            HR Contacts
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send your resume to {totalHRCount} HR contacts automatically
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                Total HR Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalHRCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Available contacts</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{categoryCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Industry segments</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                  <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                Ready to Send
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${firstResumeId ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                {firstResumeId ? "Yes" : "No"}
              </div>
              {!firstResumeId ? (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Create a resume first
                </p>
              ) : (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Resume ready to send</p>
              )}
            </CardContent>
          </Card>
        </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Overview only (no email list) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden border-l-4 border-l-purple-500 dark:border-l-purple-400">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  HR Outreach Program
                </CardTitle>
                <CardDescription className="text-sm">
                  Choose how many HR contacts to reach. Upload your resume first, then send.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For privacy and anti-spam reasons, we don't display the emails. We maintain a vetted list of <span className="font-semibold text-purple-600 dark:text-purple-400">{totalHRCount} HR contacts</span> across multiple industries. You can choose how many to reach and we'll take care of the delivery.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    How It Works
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-semibold">1</span>
                      <span>Upload your PDF resume on the right panel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-semibold">2</span>
                      <span>Specify your job title and desired number of HR contacts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-semibold">3</span>
                      <span>Click send and we'll distribute your resume professionally</span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload + Send to HR Section */}
          <div className="lg:col-span-1">
            {firstResumeId ? (
              <div className="sticky top-4 lg:top-8">
                <HRSendPanel resumeId={firstResumeId} />
              </div>
            ) : (
              <Card className="sticky top-4 lg:top-8 border-2 border-dashed border-muted-foreground/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Send className="w-5 h-5" />
                    </div>
                    Send Resume to HR
                  </CardTitle>
                  <CardDescription>Upload required to proceed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 space-y-4">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
                      <Mail className="relative w-16 h-16 text-muted-foreground/50 mx-auto" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You need to create a resume and upload a PDF before sending to HR contacts.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        No resume available
                      </div>
                    </div>
                    <a
                      href={`/dashboard`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FileText className="w-4 h-4" />
                      Create Resume
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
