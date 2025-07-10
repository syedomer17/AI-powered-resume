import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PersonalDetails from "@/models/PersonalDetails.ts";

export async function POST(req: Request) {
  await connectToDB();
  const body = await req.json();

  const resumeId = crypto.randomUUID();

  const created = await PersonalDetails.create({
    ...body,
    resumeId,
  });

  return NextResponse.json({
    success: true,
    resumeId,
  });
}
