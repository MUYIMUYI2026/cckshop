import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getAdminFromCookie } from "../adminAuth";

export type AdminUser = { id: number; email: string; name?: string };

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  adminUser: AdminUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let adminUser: AdminUser | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // Also check for admin JWT cookie (independent of Manus OAuth)
  try {
    adminUser = await getAdminFromCookie(opts.req);
  } catch {
    adminUser = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    adminUser,
  };
}
