import { getBookingStatusLabel } from "@/features/booking/lib/booking-status";

export function formatBookingDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getBookingSummary(booking) {
  return {
    id: booking.id,
    serviceName: booking.service.name,
    bookingDate: booking.bookingDate.toISOString(),
    bookingDateLabel: formatBookingDate(booking.bookingDate),
    customerName: booking.customerName,
    phone: booking.phone,
    status: booking.status,
    statusLabel: getBookingStatusLabel(booking.status),
  };
}
