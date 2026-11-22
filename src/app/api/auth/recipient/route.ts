import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSignedSessionToken,
  isRequestSessionValid,
  isRecipientPasscodeValid,
  getTrustedClientIp,
} from "@/lib/session";
import { parseJsonBodyWithByteLimit, checkSharedRateLimit } from "@/lib/stream";

/**
 * /api/auth/recipient
 *
 * Server-side access control for Harleen.
 * - POST: Validates recipient passcode and sets signed, unexpired HttpOnly cookie.
 * - GET: Reports authentication status by strictly validating the signed cookie.
 *   Never accepts credentials in query parameters.
 */

export async function POST(req: Request) {
  try {
    const clientIp = getTrustedClientIp(req);
    const rateLimitKey = `auth_failures:${clientIp || "untrusted"}`;

    // Rate-limit failed passcode attempts (max 5 failures per 15 minutes)
    const rateCheck = await checkSharedRateLimit(rateLimitKey, 5, 15 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    // Stream-level byte limit parsing (max 4KB for auth code)
    const { data, errorResponse } = await parseJsonBodyWithByteLimit<{ code?: string }>(req, 4 * 1024);
    if (errorResponse) return errorResponse;

    const rawCode = data?.code;
    if (typeof rawCode !== "string" || !rawCode.trim()) {
      return NextResponse.json({ error: "Access code is required." }, { status: 400 });
    }

    // Validate against server-only environment passcode (never client config or admin token)
    if (!isRecipientPasscodeValid(rawCode)) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
    }

    // Generate signed, unexpired session token
    let sessionToken: string;
    try {
      sessionToken = createSignedSessionToken();
    } catch (err) {
      console.error("Session creation error:", err);
      return NextResponse.json(
        { error: "Session creation failed due to server configuration." },
        { status: 500 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      message: "Recipient access verified.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err) {
    console.error("POST /api/auth/recipient error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

/**
 * Validates session status strictly using the signed cookie.
 * Query parameter credentials are never accepted.
 */
export async function GET(req: Request) {
  try {
    const isAuthenticated = isRequestSessionValid(req);
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (err) {
    console.error("GET /api/auth/recipient error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
