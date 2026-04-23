import { z } from "zod";

const phonePattern = /^[+0-9()\-.\s]{7,20}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const bookingRequestSchema = z.object({
  serviceId: z.coerce.number().int().positive("Please choose a service."),
  bookingDate: z
    .string()
    .regex(datePattern, "Please choose a valid booking date.")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return !Number.isNaN(date.getTime()) && date >= today;
    }, "Please choose today or a future date."),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Enter a valid phone number."),
});

export function normalizeBookingDate(value) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}
