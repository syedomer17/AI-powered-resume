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

// ✅ Create a rate limiter
// 100 requests per 15 minutes per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(40, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

// ✅ Public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth",           // NextAuth routes
  "/api/register",       // User registration
  "/api/verify-otp",     // Email verification
  "/api/resend-otp",     // Resend OTP
  "/api/forgot-password", // Password reset routes
  "/api/user/",          // User resume data (for PDF generation)
];

// ✅ Helper to check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(req: NextRequest) {
  // Apply only to API routes
  if (!req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;

  // ✅ Check authentication for protected routes
  if (!isPublicRoute(pathname)) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: "Authentication required",
          message: "You must be logged in to access this resource",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // ✅ Safe IP extraction (TypeScript compatible)
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // ✅ Apply rate limiting
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        limit,
        remaining,
        reset,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // ✅ Continue if within limit
  return NextResponse.next();
}

// ✅ Apply to API routes only
export const config = {
  matcher: ["/api/:path*"],
};
