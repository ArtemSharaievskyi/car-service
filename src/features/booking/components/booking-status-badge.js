import { getBookingStatusClasses, getBookingStatusLabel } from "@/features/booking/lib/booking-status";

export function BookingStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBookingStatusClasses(status)}`}
    >
      {getBookingStatusLabel(status)}
    </span>
  );
}
