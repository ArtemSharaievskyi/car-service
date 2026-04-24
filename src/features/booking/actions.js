"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sendBookingNotifications } from "@/lib/email";
import { bookingRequestSchema, normalizeBookingDate } from "@/lib/validations/booking";
import { getBookingSummary } from "@/features/booking/lib/booking-presenters";

export async function createBookingAction(_previousState, formData) {
  const parsed = bookingRequestSchema.safeParse({
    serviceId: formData.get("serviceId"),
    bookingDate: formData.get("bookingDate"),
    bookingTime: formData.get("bookingTime"),
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
      booking: null,
      emailNotificationSent: false,
    };
  }

  try {
    const service = await db.service.findUnique({
      where: { id: parsed.data.serviceId },
      select: { id: true, name: true },
    });

    if (!service) {
      return {
        status: "error",
        message: "The selected service is no longer available.",
        errors: { serviceId: ["Please choose an available service."] },
        booking: null,
        emailNotificationSent: false,
      };
    }

    const booking = await db.booking.create({
      data: {
        customerName: parsed.data.name,
        phone: parsed.data.phone,
        serviceId: parsed.data.serviceId,
        bookingDate: normalizeBookingDate(parsed.data.bookingDate, parsed.data.bookingTime),
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

    let emailNotificationSent = false;

    try {
      const emailResult = await sendBookingNotifications({
        customerName: booking.customerName,
        phone: booking.phone,
        serviceName: booking.service.name,
        bookingDate: booking.bookingDate,
      });

      emailNotificationSent = emailResult.businessNotificationSent;
    } catch (error) {
      console.error("Failed to send booking email notifications", error);
    }

    revalidatePath("/booking");

    return {
      status: "success",
      message: emailNotificationSent
        ? "Booking request received. The workshop has been notified by email and will confirm your appointment shortly."
        : "Booking request received. The workshop will confirm your appointment shortly.",
      errors: {},
      booking: getBookingSummary(booking),
      emailNotificationSent,
    };
  } catch (error) {
    console.error("Failed to create booking", error);

    return {
      status: "error",
      message: "Something went wrong while saving the booking. Please try again.",
      errors: {},
      booking: null,
      emailNotificationSent: false,
    };
  }
}
