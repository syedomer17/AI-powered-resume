import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, content, fileUrl, jobType } = body;

  const client = await clientPromise;
  const db = client.db();

  const resume = await db.collection("resumes").insertOne({
    userId,
    content,
    fileUrl,
    jobType,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, resume });
}
