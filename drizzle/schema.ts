import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products table
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: mysqlEnum("category", ["beauty", "skincare", "electronics", "daily"]).notNull(),
  retailPrice: decimal("retailPrice", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesalePrice", { precision: 10, scale: 2 }).notNull(),
  minWholesaleQty: int("minWholesaleQty").default(10).notNull(),
  stock: int("stock").default(0).notNull(),
  imageUrl: text("imageUrl"),
  brand: varchar("brand", { length: 128 }),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isBestSeller: boolean("isBestSeller").default(false).notNull(),
  isNewArrival: boolean("isNewArrival").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Contact submissions table
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 128 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isWholesaleInquiry: boolean("isWholesaleInquiry").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// Orders table
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 32 }).notNull().unique(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 128 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }),
  shippingAddress: text("shippingAddress"),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  orderType: mysqlEnum("orderType", ["retail", "wholesale"]).default("retail").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shippingFee", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order items table
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
