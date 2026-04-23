import { z } from "zod";

export const bookingRequestSchema = z.object({
  serviceType: z.string().min(1),
  vehicleId: z.string().min(1),
  preferredDate: z.string().min(1),
  notes: z.string().max(1000).optional(),
});
