import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Header from "@/components/custom/Header";
import SendToHR from "@/components/custom/SendToHR";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllHREmails, getTotalHRCount } from "@/data/hrEmails";
import { Mail, Building2, Users, Send } from "lucide-react";
import mongoose from "mongoose";

interface HRPageParams {
  params: {
    userId: string;
  };
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

  // Get HR emails
  const hrEmails = getAllHREmails();
  const totalHRCount = getTotalHRCount();

  // Organize HR emails by category (based on domain)
  const categorizedEmails: { [key: string]: string[] } = {
    "Tech Companies": [],
    "Startups": [],
    "Finance & Banking": [],
    "Healthcare & Biotech": [],
    "Other Industries": [],
  };

  hrEmails.forEach((email) => {
    if (
      email.includes("tech") ||
      email.includes("software") ||
      email.includes("digital") ||
      email.includes("cloud") ||
      email.includes("ai") ||
      email.includes("code")
    ) {
      categorizedEmails["Tech Companies"].push(email);
    } else if (email.includes("startup") || email.includes("innovation") || email.includes("venture")) {
      categorizedEmails["Startups"].push(email);
    } else if (email.includes("finance") || email.includes("banking") || email.includes("insurance")) {
      categorizedEmails["Finance & Banking"].push(email);
    } else if (email.includes("health") || email.includes("bio") || email.includes("medical")) {
      categorizedEmails["Healthcare & Biotech"].push(email);
    } else {
      categorizedEmails["Other Industries"].push(email);
    }
  });

  return (
    <>
      <Header />
      <div className="p-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">HR Contacts</h1>
          <p className="text-gray-600">
            Send your resume to {totalHRCount} HR contacts automatically
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total HR Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalHRCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Object.keys(categorizedEmails).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Ready to Send
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {firstResumeId ? "Yes" : "No"}
              </div>
              {!firstResumeId && (
                <p className="text-xs text-red-600 mt-1">Create a resume first</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* HR Email List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Email Database</CardTitle>
                <CardDescription>
                  Browse {totalHRCount} HR contacts across various industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(categorizedEmails).map(([category, emails]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {category}
                        <span className="text-sm font-normal text-gray-500">
                          ({emails.length} contacts)
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {emails.map((email, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
                          >
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Send to HR Section */}
          <div className="lg:col-span-1">
            {firstResumeId ? (
              <div className="sticky top-8">
                <SendToHR resumeId={firstResumeId} />
              </div>
            ) : (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Resume to HR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      You need to create a resume first before sending to HR contacts.
                    </p>
                    <a
                      href={`/dashboard`}
                      className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                    >
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
