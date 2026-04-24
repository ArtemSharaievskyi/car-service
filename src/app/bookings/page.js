import { BookingsPageShell } from "@/features/booking/components/bookings-page-shell";
import { isBookingStatusFilter } from "@/features/booking/lib/booking-status";

export const metadata = {
  title: "Bookings",
};

export default async function BookingsPage(props) {
  const searchParams = await props.searchParams;
  const status = searchParams?.status;
  const activeStatus = isBookingStatusFilter(status) ? status : "ALL";

  return <BookingsPageShell activeStatus={activeStatus} />;
}
