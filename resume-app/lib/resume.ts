// This should be inside an async function (e.g., an API route, or a server action)

import User, { IUser } from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

interface Params {
  userId: string;
  resumeId: string;
}

export default async function getUserData(params: Params) {
  // Get session
  const session = await getServerSession(authOptions);

  // Uncomment if you want to force login
  // if (!session || !session.user?.email) {
  //   redirect("/login");
  // }

  // Connect to DB
  await connectToDB();

  const { userId } = params;

  // Validate ObjectId if needed
  // (optional) import mongoose and validate:
  // import mongoose from "mongoose";
  // if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");

  // Fetch the user
  const user = (await User.findOne({ _id: userId }).lean()) as IUser | null;

  if (!user) {
    throw new Error("User not found");
  }

  console.log(user, "Mai dashboard me huuu");

  return user;
}
