import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { generateResumeFromJobDescription } from "@/service/AIModel";

// 👇 Define only the shape needed for creating a new resume
interface NewResume {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, title, userEmail, userName, jobDescription } = body;

    if (!title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let user;

    // Find user by ID
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    }

    // If not found, fallback to email
    if (!user && userEmail) {
      user = await User.findOne({ email: userEmail });
    }

    // Create user if still not found
    if (!user) {
      if (!userEmail) {
        return NextResponse.json({ message: "userEmail required to create user." }, { status: 400 });
      }

      user = await User.create({
        email: userEmail,
        userName: userName || "",
        emailVerified: false,
        resumes: [],
      });
    }

    // Compute next sequential resume ID
    let nextId = 1;
    if (user.resumes.length > 0) {
      const last = user.resumes[user.resumes.length - 1];
      nextId = (last.id || 0) + 1;
    }

    // Create new resume
    const newResume: any = {
      id: nextId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      personalDetails: [],
      experience: [],
      education: [],
      skills: [],
      summary: [],
      projects: [],
    };

    // If job description is provided, generate AI content
    if (jobDescription && jobDescription.trim()) {
      try {
        const aiContent = await generateResumeFromJobDescription(title, jobDescription);
        
        // Add AI-generated summary
        if (aiContent.summary) {
          newResume.summary = [{
            id: 1,
            text: aiContent.summary,
            resumeId: String(nextId),
          }];
        }

        // Add AI-generated experience
        if (aiContent.experience && aiContent.experience.length > 0) {
          newResume.experience = aiContent.experience.map((exp, index) => ({
            id: index + 1,
            ...exp,
            country: exp.state || "", // Default country if not provided
          }));
        }

        // Add AI-generated projects
        if (aiContent.projects && aiContent.projects.length > 0) {
          newResume.projects = aiContent.projects.map((proj, index) => ({
            id: index + 1,
            ...proj,
          }));
        }

        // Add AI-generated skills
        if (aiContent.skills && aiContent.skills.length > 0) {
          newResume.skills = aiContent.skills.map((skill, index) => ({
            id: index + 1,
            name: skill,
            category: "Technical",
          }));
        }
      } catch (aiError) {
        console.error("AI generation error:", aiError);
        // Continue with empty resume if AI fails
      }
    }

    user.resumes.push(newResume);
    await user.save();

    return NextResponse.json({
      message: "Resume created successfully.",
      data: {
        resume: newResume,
        userId: user._id,
      },
    }, { status: 201 });

  } catch (err) {
    console.error("Error creating resume:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
