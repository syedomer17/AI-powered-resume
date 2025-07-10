// app/api/experience/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IExperience } from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const { userId, experience } = body;

  if (!userId || !Array.isArray(experience)) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  const experienceWithIds: IExperience[] = experience.map((item: any, index: number) => ({
    ...item,
    id: index + 1,
  }));

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    user.experience = experienceWithIds;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Experience updated",
      experience: user.experience,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
