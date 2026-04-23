import { z } from "zod";

export const cartItemSchema = z.object({
  itemId: z.string().min(1),
  itemType: z.enum(["service", "part"]),
  quantity: z.number().int().positive(),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
});
