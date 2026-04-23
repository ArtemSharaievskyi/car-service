import { z } from "zod";

export const productFilterSchema = z.object({
  query: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  inStock: z.boolean().optional(),
});
