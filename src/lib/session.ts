import crypto from "crypto";

export const SESSION_COOKIE_NAME = "harleen_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

/**
 * Retrieves the server-only session secret.
 * In production: Throws an error if missing or less than 16 characters.
 * In development: Falls back to a development secret with a console warning.
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.HARLEEN_ACCESS_TOKEN;
  if (!secret || secret.trim().length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL: Missing or insecure SESSION_SECRET in production. Minimum 16 characters required."
      );
    }
    return "dev_insecure_harleen_session_secret_2026_minimum_length";
  }
  return secret.trim();
}

/**
 * Creates a cryptographically signed session token: `<timestamp>.<signature>`
 */
export function createSignedSessionToken(): string {
  const secret = getSessionSecret();
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`harleen_session_v1:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Validates a signed session token.
 * Checks signature authenticity, timestamp validity, and expiry.
 * Never validates based on cookie presence alone.
 */
export function verifySignedSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Check expiration (30 days) and clock skew (max 60s in future)
  if (now > timestamp + SESSION_MAX_AGE_MS || timestamp > now + 60_000) {
    return false;
  }

  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`harleen_session_v1:${timestampStr}`)
    .digest("hex");

  try {
    const a = Buffer.from(providedSignature, "hex");
    const b = Buffer.from(expectedSignature, "hex");
    if (a.length !== b.length || a.length !== 32) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Extracts and parses the session token from the Request's Cookie header.
 */
export function getSessionTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, ...valParts] = cookie.split("=");
    if (name.trim() === SESSION_COOKIE_NAME) {
      return decodeURIComponent(valParts.join("=").trim());
    }
  }
  return null;
}

/**
 * Validates whether the incoming request contains a valid signed session.
 */
export function isRequestSessionValid(req: Request): boolean {
  const token = getSessionTokenFromRequest(req);
  return verifySignedSessionToken(token);
}

/**
 * Validates the recipient passcode from server environment variables.
 * Does NOT accept admin tokens as recipient codes.
 * Does NOT read passcodes from client-accessible configs.
 */
export function isRecipientPasscodeValid(inputCode: string): boolean {
  if (!inputCode || typeof inputCode !== "string") return false;
  const normalizedInput = inputCode.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!normalizedInput) return false;

  const serverPasscode = process.env.RECIPIENT_PASSCODE || process.env.HARLEEN_ACCESS_TOKEN;
  if (!serverPasscode || !serverPasscode.trim()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "RECIPIENT_PASSCODE or HARLEEN_ACCESS_TOKEN is not configured in production."
      );
      return false;
    }
    // Only in local development if unconfigured
    return normalizedInput === "pucchi";
  }

  const accepted = serverPasscode
    .split(",")
    .map((s) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  return accepted.includes(normalizedInput);
}

/**
 * Client IP Resolution & Deployment Proxy Requirements:
 *
 * To prevent header spoofing, only headers overwritten by the trusted edge/reverse proxy
 * are used.
 *
 * Requirements:
 * - Cloudflare: `cf-connecting-ip` (overwritten at edge)
 * - Vercel: `x-real-ip` or `x-vercel-ip` (overwritten at edge)
 * - Custom Proxy (Nginx/Caddy): Set TRUSTED_IP_HEADER in env to the sanitized header.
 *
 * If no trusted IP header is configured or present, returns null.
 */
export function getTrustedClientIp(req: Request): string | null {
  const customHeader = process.env.TRUSTED_IP_HEADER;
  if (customHeader) {
    const val = req.headers.get(customHeader.toLowerCase());
    if (val && val.trim()) return val.trim().split(",")[0].trim();
    return null;
  }

  const cf = req.headers.get("cf-connecting-ip");
  if (cf && cf.trim()) return cf.trim();

  const realIp = req.headers.get("x-real-ip") || req.headers.get("x-vercel-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  return null;
}
