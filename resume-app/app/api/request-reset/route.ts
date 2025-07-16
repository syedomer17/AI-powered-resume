import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  await connectToDB();
  const { email } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const token = jwt.sign({ email }, process.env.RESET_SECRET!, { expiresIn: '10m' });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}">here</a> to reset password.</p>`
  });

  return NextResponse.json({ message: 'Reset link sent' });
}