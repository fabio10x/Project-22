import { verifyToken } from "@clerk/backend";
import type { Request } from "express";

/**
 * Reads the Clerk session token from the Authorization header and returns the
 * Clerk user id. Returns null when the token is missing or invalid.
 */
export async function getClerkUserId(req: Request): Promise<string | null> {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    return payload.sub;
  } catch {
    return null;
  }
}
