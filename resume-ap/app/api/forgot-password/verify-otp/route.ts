// app/api/auth/forgot-password/verify-otp/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  await connectToDB();

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  if (!user.otp || !user.otpCreatedAt) {
    return NextResponse.json({ error: 'No OTP found. Request a new one.' }, { status: 400 });
  }

  const now = new Date();
  const diff = (now.getTime() - user.otpCreatedAt.getTime()) / 1000 / 60;

  if (diff > 10) {
    return NextResponse.json({ error: 'OTP expired.' }, { status: 400 });
  }

  if (user.otp !== otp) {
    return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
  }

  user.passwordResetVerified = true;
  await user.save();

  return NextResponse.json({ message: 'OTP verified. You can now reset your password.' });
}
