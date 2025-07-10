import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDB();

  const { userName, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
    otp,
    otpCreatedAt: new Date(),
    emailVerified: false,
  });
  console.log(newUser._id)

  await newUser.save();

  // Send OTP email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Your OTP is <b>${otp}</b></p>`,
  });

  return NextResponse.json({ message: 'User created. OTP sent to email' });
}