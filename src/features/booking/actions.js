"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { bookingRequestSchema, normalizeBookingDate } from "@/lib/validations/booking";

export async function createBookingAction(_previousState, formData) {
  const parsed = bookingRequestSchema.safeParse({
    serviceId: formData.get("serviceId"),
    bookingDate: formData.get("bookingDate"),
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const service = await db.service.findUnique({
      where: { id: parsed.data.serviceId },
      select: { id: true },
    });

    if (!service) {
      return {
        status: "error",
        message: "The selected service is no longer available.",
        errors: { serviceId: ["Please choose an available service."] },
      };
    }

    await db.booking.create({
      data: {
        customerName: parsed.data.name,
        phone: parsed.data.phone,
        serviceId: parsed.data.serviceId,
        bookingDate: normalizeBookingDate(parsed.data.bookingDate),
      },
    });

    revalidatePath("/booking");

    return {
      status: "success",
      message: "Booking request received. The workshop can now confirm the visit.",
      errors: {},
    };
  } catch (error) {
    console.error("Failed to create booking", error);

    return {
      status: "error",
      message: "Something went wrong while saving the booking. Please try again.",
      errors: {},
    };
  }
}
