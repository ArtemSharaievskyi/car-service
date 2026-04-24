export const bookingStatusValues = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export const bookingStatusFilterValues = ["ALL", ...bookingStatusValues];

export const bookingStatusLabels = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const bookingStatusClasses = {
  PENDING: "border-amber-400/25 bg-amber-500/10 text-amber-100",
  CONFIRMED: "border-sky-400/25 bg-sky-500/10 text-sky-100",
  IN_PROGRESS: "border-cyan-400/25 bg-cyan-500/10 text-cyan-100",
  COMPLETED: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
  CANCELLED: "border-white/[0.12] bg-white/[0.06] text-white/70",
};

const bookingStatusTransitions = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function isBookingStatus(value) {
  return bookingStatusValues.includes(value);
}

export function isBookingStatusFilter(value) {
  return bookingStatusFilterValues.includes(value);
}

export function getBookingStatusLabel(status) {
  return bookingStatusLabels[status] ?? status;
}

export function getBookingStatusClasses(status) {
  return bookingStatusClasses[status] ?? "border-white/[0.12] bg-white/[0.06] text-white/70";
}

export function getNextBookingStatuses(status) {
  return bookingStatusTransitions[status] ?? [];
}

export function isFinalBookingStatus(status) {
  return getNextBookingStatuses(status).length === 0;
}

export function canUpdateBookingStatus(currentStatus, nextStatus) {
  if (!isBookingStatus(currentStatus) || !isBookingStatus(nextStatus)) {
    return false;
  }

  if (currentStatus === nextStatus) {
    return true;
  }

  return getNextBookingStatuses(currentStatus).includes(nextStatus);
}
