// app/api/auth/forgot-password/reset/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDB();

  const { email, newPassword, confirmPassword } = await req.json();

  if (!email || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  if (!user.passwordResetVerified) {
    return NextResponse.json({ error: 'OTP not verified. Cannot reset password.' }, { status: 403 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetVerified = false;
  user.otp = undefined;
  user.otpCreatedAt = undefined;
  await user.save();

  return NextResponse.json({ message: 'Password reset successfully.' });
}
