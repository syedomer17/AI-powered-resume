import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { avatar } = await req.json();

    if (!avatar) {
      return NextResponse.json({ message: "No avatar provided" }, { status: 400 });
    }

    await connectToDB();

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      folder: "user_avatars",
      overwrite: true,
      resource_type: "image",
      transformation: [{ width: 300, height: 300, crop: "fill" }],
    });

    if (!uploadResponse.secure_url) {
      return NextResponse.json(
        { message: "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    // Update user avatar in DB
    await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar: uploadResponse.secure_url }
    );

    // Return new avatar URL
    return NextResponse.json({
      message: "Avatar updated",
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
