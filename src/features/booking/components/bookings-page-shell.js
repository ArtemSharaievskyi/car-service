import Link from "next/link";
import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";
import { cancelBookingAction, updateBookingStatusAction } from "@/features/booking/actions";
import { BookingStatusBadge } from "@/features/booking/components/booking-status-badge";
import { formatBookingDate } from "@/features/booking/lib/booking-presenters";
import {
  bookingStatusFilterValues,
  bookingStatusLabels,
  bookingStatusValues,
  getNextBookingStatuses,
} from "@/features/booking/lib/booking-status";
import { db } from "@/lib/db";

async function getBookingCounts() {
  const groupedCounts = await db.booking.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  const counts = {
    ALL: groupedCounts.reduce((total, item) => total + item._count._all, 0),
  };

  for (const item of groupedCounts) {
    counts[item.status] = item._count._all;
  }

  return counts;
}

async function getBookings(activeStatus) {
  return db.booking.findMany({
    where: activeStatus === "ALL" ? undefined : { status: activeStatus },
    orderBy: [{ bookingDate: "asc" }, { createdAt: "desc" }],
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
}

function getFilterHref(status) {
  return status === "ALL" ? "/bookings" : `/bookings?status=${status}`;
}

function getFilterLabel(status) {
  return status === "ALL" ? "All" : bookingStatusLabels[status];
}

export async function BookingsPageShell({ activeStatus }) {
  const [counts, bookings] = await Promise.all([getBookingCounts(), getBookings(activeStatus)]);

  return (
    <>
      <PageIntro
        eyebrow="Workshop Queue"
        title="Track every service booking after it is submitted."
        description="Review incoming requests, move them through the workshop lifecycle, and keep the current status visible at a glance."
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              Status overview
            </p>

            {bookingStatusValues.map((status) => (
              <div
                key={status}
                className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4 last:border-b-0 last:pb-0"
              >
                <BookingStatusBadge status={status} />
                <span className="text-sm font-semibold text-white">{counts[status] ?? 0}</span>
              </div>
            ))}
          </div>
        }
      />

      <SectionBlock
        title="Bookings"
        description="Pending bookings can be confirmed, confirmed bookings can move into work, and in-progress bookings can be completed. Cancellation remains available until the job is finished."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {bookingStatusFilterValues.map((status) => {
              const isActive = status === activeStatus;

              return (
                <Link
                  key={status}
                  href={getFilterHref(status)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-white"
                      : "border-white/[0.08] text-white/65 hover:border-white/18 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {getFilterLabel(status)} ({counts[status] ?? 0})
                </Link>
              );
            })}
          </div>

          {bookings.length ? (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const nextStatuses = getNextBookingStatuses(booking.status);
                const canCancel = booking.status !== "COMPLETED" && booking.status !== "CANCELLED";

                return (
                  <article key={booking.id} className="panel rounded-lg p-5">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="grid flex-1 gap-5 md:grid-cols-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">Service</p>
                          <p className="mt-2 text-sm font-semibold text-white">{booking.service.name}</p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">Date</p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {formatBookingDate(booking.bookingDate)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">Customer</p>
                          <p className="mt-2 text-sm font-semibold text-white">{booking.customerName}</p>
                          <p className="mt-1 text-sm text-white/58">{booking.phone}</p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">Status</p>
                          <div className="mt-2">
                            <BookingStatusBadge status={booking.status} />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {nextStatuses.length ? (
                          <form action={updateBookingStatusAction} className="flex flex-wrap items-center gap-2">
                            <input type="hidden" name="bookingId" value={booking.id} />
                            <select
                              name="status"
                              defaultValue={nextStatuses[0]}
                              className="h-10 rounded-full border border-white/[0.08] bg-slate-950 px-4 text-sm text-white outline-none"
                            >
                              {nextStatuses.map((status) => (
                                <option key={status} value={status}>
                                  Move to {bookingStatusLabels[status]}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)]"
                            >
                              Update
                            </button>
                          </form>
                        ) : (
                          <p className="text-sm text-white/45">Final status</p>
                        )}

                        {canCancel ? (
                          <form action={cancelBookingAction}>
                            <input type="hidden" name="bookingId" value={booking.id} />
                            <button
                              type="submit"
                              className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white/78 transition hover:border-white/18 hover:bg-white/[0.04] hover:text-white"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="panel rounded-lg p-6">
              <p className="text-lg font-semibold text-white">No bookings in this view</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                {activeStatus === "ALL"
                  ? "New booking requests will appear here as soon as customers submit the appointment form."
                  : `There are no ${getFilterLabel(activeStatus).toLowerCase()} bookings right now.`}
              </p>
            </div>
          )}
        </div>
      </SectionBlock>
    </>
  );
}
