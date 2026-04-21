import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()),
  categoryId: z.string().uuid(),
});

export const productUpdateSchema = productSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1),
});
