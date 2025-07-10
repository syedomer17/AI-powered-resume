// app/api/user/summary/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, text } = body;

    if (!userId || !text) {
      return NextResponse.json(
        { success: false, message: "Missing userId or text." },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    let nextId = 1;
    if (user.summary?.length > 0) {
      const lastItem = user.summary[user.summary.length - 1];
      nextId = (lastItem.id || 0) + 1;
    }

    const newSummary = {
      id: nextId,
      text,
    };

    user.summary.push(newSummary);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Summary added successfully.",
      summary: user.summary,
    });
  } catch (err) {
    console.error("Error updating summary:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
