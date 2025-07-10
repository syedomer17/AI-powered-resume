import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, title, userEmail, userName } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required." },
        { status: 400 }
      );
    }

    let user;

    // ✅ If userId is provided
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid userId." },
          { status: 400 }
        );
      }
      user = await User.findById(userId);
    }

    // ✅ If no user found via userId, fallback to email
    if (!user && userEmail) {
      user = await User.findOne({ email: userEmail });
    }

    // ✅ If still no user, create
    if (!user) {
      if (!userEmail) {
        return NextResponse.json(
          { message: "userEmail required to create a new user." },
          { status: 400 }
        );
      }
      user = await User.create({
        email: userEmail,
        userName: userName || "",
        emailVerified: false,
        resumes: [],
      });
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found or created." },
        { status: 400 }
      );
    }

    // Compute next id
    let nextId = 1;
    if (user.resumes && user.resumes.length > 0) {
      const lastItem = user.resumes[user.resumes.length - 1];
      nextId = (lastItem.id || 0) + 1;
    }

    const newResume = {
      id: nextId,
      title,
      createdAt: new Date(),
    };

    user.resumes.push(newResume);
    await user.save();

    return NextResponse.json(
      {
        message: "Resume created successfully.",
        data: {
          resume: newResume,
          userId: user._id, // always return for frontend
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
