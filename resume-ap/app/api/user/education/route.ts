// app/api/education/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { IEducation } from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const { userId, education } = body;

  if (!userId || !Array.isArray(education)) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  const educationWithIds: IEducation[] = education.map((item: any, index: number) => ({
    ...item,
    id: index + 1,
  }));

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    user.education = educationWithIds;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Education updated",
      education: user.education,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
