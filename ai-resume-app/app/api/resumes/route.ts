import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDB } from "@/lib/mongodb";
import UserResume from "@/models/UserResume";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const resumes = await UserResume.find({ userEmail: session.user?.email });
  return NextResponse.json(resumes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  await connectToDB();

  const newResume = await UserResume.create({
    title,
    userEmail: session.user?.email,
    userName: session.user?.name,
  });

  return NextResponse.json(newResume, { status: 201 });
}
