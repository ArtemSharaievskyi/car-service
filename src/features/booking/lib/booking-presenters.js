import { formatBookingDate, formatBookingTime } from "@/lib/booking-datetime";
import { getBookingStatusLabel } from "@/features/booking/lib/booking-status";

export function getBookingSummary(booking) {
  return {
    id: booking.id,
    serviceName: booking.service.name,
    bookingDate: booking.bookingDate.toISOString(),
    bookingDateLabel: formatBookingDate(booking.bookingDate),
    bookingTimeLabel: formatBookingTime(booking.bookingDate),
    customerName: booking.customerName,
    email: booking.email ?? "",
    phone: booking.phone,
    status: booking.status,
    statusLabel: getBookingStatusLabel(booking.status),
  };
}
