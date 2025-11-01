import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  await connectToDB();

  try {
    const user = await User.findOne({ email: session.user.email }).select("-password -otp");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  await connectToDB();

  try {
    const body = await request.json().catch(() => ({}));
    const allowed: Record<string, unknown> = {};

    if (typeof body.userName === 'string' && body.userName.trim().length) {
      allowed.userName = body.userName.trim();
    }
    if (typeof body.avatar === 'string') {
      allowed.avatar = body.avatar.trim();
    }
    if (typeof body.bio === 'string') {
      allowed.bio = body.bio;
    }

    // Do not allow email updates here
    if (Object.keys(allowed).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updated = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: allowed },
      { new: true, projection: { password: 0, otp: 0 } }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
