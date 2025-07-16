//app/api/auth/verify-otp

import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectToDB();

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: 'Email already verified' });
  }

  if (!user.otp || !user.otpCreatedAt) {
    return NextResponse.json(
      { error: 'OTP not found or expired, please request a new one' },
      { status: 400 }
    );
  }

  const OTP_VALIDITY_MINUTES = 5;
  const now = new Date();
  const otpAgeMinutes = (now.getTime() - new Date(user.otpCreatedAt).getTime()) / 1000 / 60;

  if (otpAgeMinutes > OTP_VALIDITY_MINUTES) {
    return NextResponse.json(
      { error: 'OTP expired, please request a new one' },
      { status: 400 }
    );
  }

  if (user.otp !== otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  // Mark verified, keep OTP & otpCreatedAt intact
  user.emailVerified = true;
  await user.save();

  return NextResponse.json({ message: 'Email verified successfully' });
}
