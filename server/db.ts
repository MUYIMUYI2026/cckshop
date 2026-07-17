import { and, eq, ilike, like, or, sql, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, contactSubmissions, InsertContactSubmission, orders, orderItems, InsertProduct, Order, buyerAccounts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Products queries
export async function getProducts(opts?: {
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [];
  if (opts?.category && opts.category !== 'all') {
    conditions.push(eq(products.category, opts.category as any));
  }
  if (opts?.search) {
    conditions.push(
      or(
        like(products.name, `%${opts.search}%`),
        like(products.brand, `%${opts.search}%`)
      )
    );
  }
  if (opts?.featured !== undefined) conditions.push(eq(products.isFeatured, opts.featured));
  if (opts?.bestSeller !== undefined) conditions.push(eq(products.isBestSeller, opts.bestSeller));
  if (opts?.newArrival !== undefined) conditions.push(eq(products.isNewArrival, opts.newArrival));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const query = db.select().from(products);
  if (whereClause) query.where(whereClause);

  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;
  query.limit(limit).offset(offset);

  const items = await query;
  return { items, total: items.length };
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function submitContact(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactSubmissions).values(data);
}

// ============ Admin queries ============

// Dashboard stats
export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalProducts: 0, totalOrders: 0, totalUsers: 0, totalContacts: 0, recentOrders: [] };

  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [contactCount] = await db.select({ count: sql<number>`count(*)` }).from(contactSubmissions);
  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

  return {
    totalProducts: Number(productCount.count),
    totalOrders: Number(orderCount.count),
    totalUsers: Number(userCount.count),
    totalContacts: Number(contactCount.count),
    recentOrders,
  };
}

// Admin product management
export async function adminCreateProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(products).values(data);
}

export async function adminUpdateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function adminDeleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// Admin order management
export async function getOrders(opts?: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [];
  if (opts?.status && opts.status !== 'all') {
    conditions.push(eq(orders.status, opts.status as any));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const query = db.select().from(orders).orderBy(desc(orders.createdAt));
  if (whereClause) query.where(whereClause);

  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;
  query.limit(limit).offset(offset);

  const items = await query;
  return { items, total: items.length };
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (result.length === 0) return undefined;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...result[0], items };
}

export async function updateOrderStatus(id: number, status: Order['status']) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}

// Admin user management
export async function getUsers(opts?: { limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const items = await db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
  return { items, total: items.length };
}

// ============ Buyer queries ============

export async function getBuyerOrders(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  const buyerOrderList = await db
    .select()
    .from(orders)
    .where(eq(orders.buyerAccountId, buyerId))
    .orderBy(desc(orders.createdAt));
  return buyerOrderList;
}

export async function getBuyerOrderById(orderId: number, buyerId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.buyerAccountId, buyerId)))
    .limit(1);
  if (result.length === 0) return undefined;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { ...result[0], items };
}

export async function updateBuyerProfile(
  id: number,
  data: { firstName?: string; lastName?: string; phone?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(buyerAccounts).set(data).where(eq(buyerAccounts.id, id));
}

export async function updateBuyerPassword(id: number, newHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(buyerAccounts).set({ passwordHash: newHash }).where(eq(buyerAccounts.id, id));
}

export async function getBuyerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({
      id: buyerAccounts.id,
      email: buyerAccounts.email,
      firstName: buyerAccounts.firstName,
      lastName: buyerAccounts.lastName,
      phone: buyerAccounts.phone,
      createdAt: buyerAccounts.createdAt,
    })
    .from(buyerAccounts)
    .where(eq(buyerAccounts.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Admin contact submissions
export async function getContactSubmissions(opts?: { limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const items = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset);
  return { items, total: items.length };
}
