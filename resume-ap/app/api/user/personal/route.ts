// app/api/user/personal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDB();

  const body = await req.json();
  const {
    userId,
    firstName,
    lastName,
    jobTitle,
    address,
    phone,
    email,
    themeColor,
    // summery
  } = body;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Missing userId" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Compute next id safely
    let nextId = 1;
    if (user.personalDetails.length > 0) {
      const lastItem = user.personalDetails[user.personalDetails.length - 1];
      nextId = (lastItem.id || 0) + 1;
    }

    const newDetail = {
      id: nextId,
      firstName,
      lastName,
      jobTitle,
      address,
      phone,
      email,
      themeColor: themeColor || "#ff6666",
      // summery: summery || ""
    };

    user.personalDetails.push(newDetail);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Personal detail added",
      personalDetails: user.personalDetails
    });
  } catch (err) {
    console.error("Error updating personal details:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
