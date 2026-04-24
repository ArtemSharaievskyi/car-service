const bookingLocale = "en-US";
const bookingDisplayTimeZone = "UTC";

export function formatBookingDate(value) {
  return new Intl.DateTimeFormat(bookingLocale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: bookingDisplayTimeZone,
  }).format(new Date(value));
}

export function formatBookingTime(value) {
  return new Intl.DateTimeFormat(bookingLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: bookingDisplayTimeZone,
  }).format(new Date(value));
}
