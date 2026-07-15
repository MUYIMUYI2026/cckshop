import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getProducts, getProductBySlug, getProductById, submitContact } from "./db";

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
        if (!product) throw new Error("Product not found");
        return product;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new Error("Product not found");
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
});

export type AppRouter = typeof appRouter;
