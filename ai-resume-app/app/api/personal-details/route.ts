// app/api/personal-details/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PersonalDetails from "@/models/PersonalDetails.ts";

export async function POST(req: Request) {
  await connectToDB();
  const body = await req.json();

  // If you still want to validate required fields, you can do it here:
  if (!body.email || !body.firstName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const savedDetails = await PersonalDetails.create(body);

  return NextResponse.json(savedDetails, { status: 201 });
}
