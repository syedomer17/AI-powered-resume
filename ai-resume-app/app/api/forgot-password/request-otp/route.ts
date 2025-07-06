// app/api/auth/forgot-password/request-otp/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  await connectToDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpCreatedAt = new Date();
  user.passwordResetVerified = false;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Password Reset',
    html: `
      <p>Hello ${user.name || ''},</p>
      <p>Your OTP for password reset is:</p>
      <h2>${otp}</h2>
      <p>It expires in 10 minutes.</p>
    `,
  });

  return NextResponse.json({ message: 'OTP sent to email.' });
}
