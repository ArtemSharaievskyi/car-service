import "server-only";

import { Resend } from "resend";
import { formatBookingDate, formatBookingTime } from "@/lib/booking-datetime";
import { brand } from "@/lib/brand";

function extractEmailAddress(value) {
  if (!value) {
    return null;
  }

  const match = value.match(/<([^>]+)>/);

  return (match?.[1] ?? value).trim();
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const businessEmail = extractEmailAddress(from);

  if (!apiKey || !from || !businessEmail) {
    return null;
  }

  return {
    apiKey,
    from,
    businessEmail,
  };
}

function buildBusinessEmail({ customerName, phone, serviceName, bookingDate }) {
  const dateLabel = formatBookingDate(bookingDate);
  const timeLabel = formatBookingTime(bookingDate);
  const subject = `New booking request: ${serviceName}`;

  return {
    subject,
    text: [
      `New booking request for ${brand.name}`,
      "",
      `Customer: ${customerName}`,
      `Phone: ${phone}`,
      `Service: ${serviceName}`,
      `Date: ${dateLabel}`,
      `Time: ${timeLabel}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin-bottom: 16px;">New booking request</h2>
        <p style="margin: 0 0 12px;">A new booking was submitted on the ${brand.name} website.</p>
        <table style="border-collapse: collapse;">
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Customer</td><td style="padding: 6px 0;">${customerName}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Phone</td><td style="padding: 6px 0;">${phone}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Service</td><td style="padding: 6px 0;">${serviceName}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Date</td><td style="padding: 6px 0;">${dateLabel}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Time</td><td style="padding: 6px 0;">${timeLabel}</td></tr>
        </table>
      </div>
    `,
  };
}

export async function sendBookingNotifications(bookingDetails) {
  const config = getEmailConfig();

  if (!config) {
    return {
      businessNotificationSent: false,
      customerNotificationSent: false,
    };
  }

  const resend = new Resend(config.apiKey);
  const businessEmail = buildBusinessEmail(bookingDetails);
  const businessResult = await resend.emails.send({
    from: config.from,
    to: [config.businessEmail],
    subject: businessEmail.subject,
    text: businessEmail.text,
    html: businessEmail.html,
  });

  if (businessResult.error) {
    throw new Error(businessResult.error.message);
  }

  return {
    businessNotificationSent: true,
    customerNotificationSent: false,
  };
}
