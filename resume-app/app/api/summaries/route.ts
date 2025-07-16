import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Summary from "@/models/Summary";

export async function POST(req: Request) {
  await connectToDB();

  const body = await req.json();

  if (!body.summary) {
    return NextResponse.json(
      { message: "Summary is required." },
      { status: 400 }
    );
  }

  const saved = await Summary.create({
    summary: body.summary,
  });

  return NextResponse.json(saved, { status: 201 });
}
