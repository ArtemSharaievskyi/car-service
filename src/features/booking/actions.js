"use server";

import { refresh, revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { bookingRequestSchema, normalizeBookingDate } from "@/lib/validations/booking";
import { getBookingSummary } from "@/features/booking/lib/booking-presenters";
import { canUpdateBookingStatus, isFinalBookingStatus, isBookingStatus } from "@/features/booking/lib/booking-status";

const bookingStatusUpdateSchema = z.object({
  bookingId: z.coerce.number().int().positive("Booking not found."),
  status: z.string().refine(isBookingStatus, "Choose a valid booking status."),
});

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
      booking: null,
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
        booking: null,
      };
    }

    const booking = await db.booking.create({
      data: {
        customerName: parsed.data.name,
        phone: parsed.data.phone,
        serviceId: parsed.data.serviceId,
        bookingDate: normalizeBookingDate(parsed.data.bookingDate),
      },
      select: {
        id: true,
        customerName: true,
        phone: true,
        bookingDate: true,
        status: true,
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    revalidatePath("/booking");
    revalidatePath("/bookings");

    return {
      status: "success",
      message: "Booking request received. Your appointment is now pending workshop confirmation.",
      errors: {},
      booking: getBookingSummary(booking),
    };
  } catch (error) {
    console.error("Failed to create booking", error);

    return {
      status: "error",
      message: "Something went wrong while saving the booking. Please try again.",
      errors: {},
      booking: null,
    };
  }
}

export async function updateBookingStatusAction(formData) {
  const parsed = bookingStatusUpdateSchema.safeParse({
    bookingId: formData.get("bookingId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return;
  }

  const booking = await db.booking.findUnique({
    where: { id: parsed.data.bookingId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!booking || isFinalBookingStatus(booking.status)) {
    refresh();
    return;
  }

  if (!canUpdateBookingStatus(booking.status, parsed.data.status)) {
    refresh();
    return;
  }

  await db.booking.update({
    where: { id: booking.id },
    data: { status: parsed.data.status },
  });

  revalidatePath("/bookings");
  refresh();
}

export async function cancelBookingAction(formData) {
  const parsed = z
    .object({
      bookingId: z.coerce.number().int().positive("Booking not found."),
    })
    .safeParse({
      bookingId: formData.get("bookingId"),
    });

  if (!parsed.success) {
    return;
  }

  const booking = await db.booking.findUnique({
    where: { id: parsed.data.bookingId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!booking || booking.status === "COMPLETED" || booking.status === "CANCELLED") {
    refresh();
    return;
  }

  await db.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/bookings");
  refresh();
}
