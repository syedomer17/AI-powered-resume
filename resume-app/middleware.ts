import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";

// ✅ Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ✅ Global limit (general API traffic)
const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(300, "1 m"), // 300 req/min
  prefix: "global-limit",
});

// ✅ Strict limit for AI heavy paths
const aiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(7, "1 m"), // 7 AI calls/min
  prefix: "ai-limit",
});

// ✅ Routes that trigger AI usage
const AI_HEAVY_ROUTES = [
  "/api/generate-resume",
  "/api/analyze-ats",
  "/api/ats-score",
  "/api/ats/analyze-pdf",
  "/api/jobs/auto-apply",
  "/api/summaries",
  "/api/resume",
];

// ✅ Public routes (no auth needed)
const PUBLIC_API_ROUTES = [
  "/api/auth",
  "/api/register",
  "/api/verify-otp",
  "/api/resend-otp",
  "/api/forgot-password",
  "/api/request-reset",
];

function isPublic(path: string) {
  return PUBLIC_API_ROUTES.some((r) => path.startsWith(r));
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ Only protect API routes
  if (!path.startsWith("/api")) return NextResponse.next();

  // ✅ Auth check for protected routes
  if (!isPublic(path)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }
  }

  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // ✅ Limit AI routes separately
  if (AI_HEAVY_ROUTES.some((r) => path.startsWith(r))) {
    try {
      const { success } = await aiLimiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "AI rate limit reached, please wait 👇", retryIn: "1 minute" },
          { status: 429 }
        );
      }
    } catch {
      console.warn("⚠️ Upstash AI limit skipped (server busy)");
    }
  }

  // ✅ Global limit
  try {
    const { success } = await globalLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  } catch {
    console.warn("⚠️ Upstash global limit skipped");
  }

  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
