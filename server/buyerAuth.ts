import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { buyerAccounts } from "../drizzle/schema";

const BUYER_JWT_SECRET = new TextEncoder().encode(
  (process.env.JWT_SECRET ?? "fallback") + "_buyer_store"
);
const BUYER_COOKIE = "buyer_session";

export async function getBuyerFromCookie(
  req: Request
): Promise<{ id: number; email: string; firstName: string; lastName: string } | null> {
  try {
    const token = req.cookies?.[BUYER_COOKIE];
    if (!token) return null;
    const { payload } = await jwtVerify(token, BUYER_JWT_SECRET);
    return payload as unknown as { id: number; email: string; firstName: string; lastName: string };
  } catch {
    return null;
  }
}

export function buyerAuthRouter(): Router {
  const router = Router();

  // POST /api/buyer-auth/register
  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      // Check if email already exists
      const existing = await db
        .select({ id: buyerAccounts.id })
        .from(buyerAccounts)
        .where(eq(buyerAccounts.email, email.toLowerCase().trim()))
        .limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const [result] = await db.insert(buyerAccounts).values({
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
      });

      const newId = (result as any).insertId;
      const token = await new SignJWT({
        id: newId,
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30d")
        .sign(BUYER_JWT_SECRET);

      res.cookie(BUYER_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return res.json({
        success: true,
        user: { id: newId, email: email.toLowerCase().trim(), firstName, lastName },
      });
    } catch (err) {
      console.error("[BuyerAuth] Register error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/buyer-auth/login
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const results = await db
        .select()
        .from(buyerAccounts)
        .where(eq(buyerAccounts.email, email.toLowerCase().trim()))
        .limit(1);
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const account = results[0];
      const valid = await bcrypt.compare(password, account.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      await db
        .update(buyerAccounts)
        .set({ lastLoginAt: new Date() })
        .where(eq(buyerAccounts.id, account.id));

      const token = await new SignJWT({
        id: account.id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30d")
        .sign(BUYER_JWT_SECRET);

      res.cookie(BUYER_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return res.json({
        success: true,
        user: {
          id: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
        },
      });
    } catch (err) {
      console.error("[BuyerAuth] Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/buyer-auth/logout
  router.post("/logout", (_req: Request, res: Response) => {
    res.clearCookie(BUYER_COOKIE, { path: "/" });
    return res.json({ success: true });
  });

  // GET /api/buyer-auth/me
  router.get("/me", async (req: Request, res: Response) => {
    const buyer = await getBuyerFromCookie(req);
    if (!buyer) return res.status(401).json({ error: "Not authenticated" });
    return res.json(buyer);
  });

  return router;
}
