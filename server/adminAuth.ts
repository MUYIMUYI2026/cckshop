import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { adminAccounts } from "../drizzle/schema";

const ADMIN_JWT_SECRET = new TextEncoder().encode((process.env.JWT_SECRET ?? "fallback") + "_admin_panel");
const ADMIN_COOKIE = "admin_session";

export async function getAdminFromCookie(req: Request): Promise<{ id: number; email: string; name?: string } | null> {
  try {
    const token = req.cookies?.[ADMIN_COOKIE];
    if (!token) return null;
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload as unknown as { id: number; email: string };
  } catch {
    return null;
  }
}


export function adminAuthRouter(): Router {
  const router = Router();

  // POST /api/admin-auth/login
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const results = await db.select().from(adminAccounts).where(eq(adminAccounts.email, email.toLowerCase())).limit(1);
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const account = results[0];
      const valid = await bcrypt.compare(password, account.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      await db.update(adminAccounts).set({ lastLoginAt: new Date() }).where(eq(adminAccounts.id, account.id));

      // Issue JWT cookie
      const token = await new SignJWT({ id: account.id, email: account.email, name: account.name })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(ADMIN_JWT_SECRET);
      res.cookie(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return res.json({ success: true, name: account.name, email: account.email });
    } catch (err) {
      console.error("[AdminAuth] Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/admin-auth/logout
  router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie(ADMIN_COOKIE, { path: "/" });
    return res.json({ success: true });
  });

  // GET /api/admin-auth/me
  router.get("/me", async (req: Request, res: Response) => {
    const admin = await getAdminFromCookie(req);
    if (!admin) return res.status(401).json({ error: "Not authenticated" });
    return res.json(admin);
  });

  return router;
}
