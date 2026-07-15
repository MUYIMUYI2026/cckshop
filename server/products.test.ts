import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getProducts: vi.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        name: "Test Serum",
        slug: "test-serum",
        description: "A test product",
        category: "skincare",
        retailPrice: "29.99",
        wholesalePrice: "18.50",
        minWholesaleQty: 12,
        stock: 100,
        imageUrl: null,
        brand: "TestBrand",
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 1,
  }),
  getProductBySlug: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test Serum",
    slug: "test-serum",
    description: "A test product",
    category: "skincare",
    retailPrice: "29.99",
    wholesalePrice: "18.50",
    minWholesaleQty: 12,
    stock: 100,
    imageUrl: null,
    brand: "TestBrand",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getProductById: vi.fn().mockResolvedValue(null),
  submitContact: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("products router", () => {
  it("lists products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.products.list({});
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("Test Serum");
  });

  it("gets product by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.products.getBySlug({ slug: "test-serum" });
    expect(result.name).toBe("Test Serum");
    expect(result.retailPrice).toBe("29.99");
    expect(result.wholesalePrice).toBe("18.50");
  });
});

describe("contact router", () => {
  it("submits contact form", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@example.com",
      message: "I'd like to inquire about wholesale pricing.",
      isWholesaleInquiry: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "John",
        email: "not-an-email",
        message: "Hello",
      })
    ).rejects.toThrow();
  });
});
