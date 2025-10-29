import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

interface Attachment {
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
}

interface EmailPayload {
  to: string[];
  cc?: string[];
  bcc?: string[];
  from: string;
  fromName?: string;
  gmailOwner: string;
  gmailAppPassword: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: Attachment[];
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  quota_remaining?: number;
  error?: string;
}

export const runtime = 'nodejs'; // important for Next.js App Router

console.log("from",process.env.EMAIL_SENDER!);
console.log("suhail",process.env.SUHAIL_API_KEY!);
console.log("email",process.env.GMAIL_OWNER!);


const sendEmail = async (apiKey: string, payload: EmailPayload): Promise<EmailResponse> => {
  const response = await fetch('https://email.suhail.app/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  let data: EmailResponse;
  try {
    data = await response.json();
  } catch {
    const text = await response.text();
    console.error('Invalid JSON from API:', text);
    throw new Error('Email API returned invalid JSON');
  }

  return data;
};

export async function POST(req: Request) {
  await connectToDB();
  const { userName, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
    otp,
    otpCreatedAt: new Date(),
    emailVerified: false,
  });
  await newUser.save();

  const result = await sendEmail(process.env.SUHAIL_API_KEY!, {
    to: [email],
    from: process.env.EMAIL_SENDER!,
    fromName: "HireAI",
    gmailOwner: process.env.GMAIL_OWNER!,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD!,
    subject: "Verify your email",
    html: `<p>Your OTP is <b>${otp}</b></p>`,
  });

  if (!result.success) {
    console.error("Email API Error:", result);
    return NextResponse.json(
      { error: 'Failed to send OTP email', details: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: 'User created. OTP sent to email' });
}
