import { z } from "zod";

export const cartItemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  compatibleBrand: z.string().min(1),
  compatibleModel: z.string().min(1),
  image: z.string().min(1),
  price: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).default([]),
});
