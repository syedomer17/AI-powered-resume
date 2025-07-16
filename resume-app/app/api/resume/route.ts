import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

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
    const { userId, title, userEmail, userName } = body;

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
    const newResume: NewResume = {
      id: nextId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
