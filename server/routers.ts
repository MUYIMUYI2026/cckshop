import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getProducts, getProductBySlug, getProductById, submitContact,
  getAdminStats, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  getOrders, getOrderById, updateOrderStatus, getUsers, getContactSubmissions,
} from "./db";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  products: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        sort: z.string().optional(),
        featured: z.boolean().optional(),
        bestSeller: z.boolean().optional(),
        newArrival: z.boolean().optional(),
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getProducts(input);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await getProductBySlug(input.slug);
        if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        return product;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        return product;
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(128),
        email: z.string().email().max(320),
        company: z.string().max(128).optional(),
        subject: z.string().max(255).optional(),
        message: z.string().min(1),
        isWholesaleInquiry: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        await submitContact({
          name: input.name,
          email: input.email,
          company: input.company ?? null,
          subject: input.subject ?? null,
          message: input.message,
          isWholesaleInquiry: input.isWholesaleInquiry ?? false,
        });
        return { success: true };
      }),
  }),

  // ============ Admin routes ============
  admin: router({
    // Dashboard stats
    stats: adminProcedure.query(async () => {
      return await getAdminStats();
    }),

    // Product management
    products: router({
      list: adminProcedure
        .input(z.object({
          category: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getProducts({ ...input, limit: input?.limit ?? 50 });
        }),

      create: adminProcedure
        .input(z.object({
          name: z.string().min(1).max(255),
          slug: z.string().min(1).max(255),
          description: z.string().optional(),
          category: z.enum(["beauty", "skincare", "electronics", "daily"]),
          retailPrice: z.string(),
          wholesalePrice: z.string(),
          minWholesaleQty: z.number().default(10),
          stock: z.number().default(0),
          imageUrl: z.string().optional(),
          brand: z.string().optional(),
          isFeatured: z.boolean().default(false),
          isBestSeller: z.boolean().default(false),
          isNewArrival: z.boolean().default(true),
        }))
        .mutation(async ({ input }) => {
          await adminCreateProduct({
            ...input,
            description: input.description ?? null,
            imageUrl: input.imageUrl ?? null,
            brand: input.brand ?? null,
          });
          return { success: true };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().min(1).max(255).optional(),
          slug: z.string().min(1).max(255).optional(),
          description: z.string().optional().nullable(),
          category: z.enum(["beauty", "skincare", "electronics", "daily"]).optional(),
          retailPrice: z.string().optional(),
          wholesalePrice: z.string().optional(),
          minWholesaleQty: z.number().optional(),
          stock: z.number().optional(),
          imageUrl: z.string().optional().nullable(),
          brand: z.string().optional().nullable(),
          isFeatured: z.boolean().optional(),
          isBestSeller: z.boolean().optional(),
          isNewArrival: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await adminUpdateProduct(id, data);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await adminDeleteProduct(input.id);
          return { success: true };
        }),
    }),

    // Order management
    orders: router({
      list: adminProcedure
        .input(z.object({
          status: z.string().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getOrders(input);
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const order = await getOrderById(input.id);
          if (!order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
          return order;
        }),

      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
        }))
        .mutation(async ({ input }) => {
          await updateOrderStatus(input.id, input.status);
          return { success: true };
        }),
    }),

    // User management
    users: router({
      list: adminProcedure
        .input(z.object({
          limit: z.number().optional(),
          offset: z.number().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getUsers(input);
        }),
    }),

    // Contact submissions
    contacts: router({
      list: adminProcedure
        .input(z.object({
          limit: z.number().optional(),
          offset: z.number().optional(),
        }).optional())
        .query(async ({ input }) => {
          return await getContactSubmissions(input);
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
