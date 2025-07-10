// app/api/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User, { ISkill } from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();

  const { userId, skills } = body;

  if (!userId || !skills) {
    return NextResponse.json(
      { success: false, message: "Missing fields" },
      { status: 400 }
    );
  }

  if (!Array.isArray(skills)) {
    return NextResponse.json(
      { success: false, message: "Skills must be an array" },
      { status: 400 }
    );
  }

  // Validate each skill
  for (const [index, skill] of skills.entries()) {
    if (
      typeof skill.name !== "string" ||
      skill.name.trim() === ""
    ) {
      return NextResponse.json(
        { success: false, message: `Skill at index ${index} must have a valid name` },
        { status: 400 }
      );
    }
    if (
      typeof skill.rating !== "number" ||
      skill.rating < 1 ||
      skill.rating > 5
    ) {
      return NextResponse.json(
        { success: false, message: `Skill rating for "${skill.name}" must be between 1 and 5` },
        { status: 400 }
      );
    }
  }

  // Assign numeric sequential IDs
  const skillsWithIds: ISkill[] = skills.map((item: any, index: number) => ({
    ...item,
    id: index + 1,
  }));

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.skills = skillsWithIds;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Skills updated",
      skills: user.skills,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
