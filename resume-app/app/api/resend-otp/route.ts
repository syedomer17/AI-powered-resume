//app/api/auth/resend-otp/route.ts

import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectToDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.emailVerified) {
    return NextResponse.json({ message: 'Email already verified' });
  }

  // Generate new OTP and save timestamp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpCreatedAt = new Date();
  await user.save();

  // Send OTP email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your New OTP Code',
    html: `<p>Your new OTP is <b>${otp}</b></p>`,
  });

  return NextResponse.json({ message: 'OTP resent successfully' });
}
