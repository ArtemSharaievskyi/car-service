import "server-only";

import { Resend } from "resend";
import { formatBookingDate, formatBookingTime } from "@/lib/booking-datetime";
import { brand } from "@/lib/brand";

const businessBookingEmail = "artemsharaievskyi231@gmail.com";

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return null;
  }

  return {
    apiKey,
    from,
  };
}

function maskEmailAddress(email) {
  const [localPart = "", domain = ""] = String(email).split("@");
  const maskedLocal = localPart.length <= 2 ? `${localPart[0] ?? "*"}*` : `${localPart.slice(0, 2)}***`;

  return domain ? `${maskedLocal}@${domain}` : maskedLocal;
}

function logEmailFailure(scope, recipient, error) {
  console.error("Email delivery failed", {
    scope,
    recipient: maskEmailAddress(recipient),
    message: error instanceof Error ? error.message : "Unknown email error",
  });
}

function buildBusinessEmail({ customerName, customerEmail, phone, serviceName, bookingDate }) {
  const dateLabel = formatBookingDate(bookingDate);
  const timeLabel = formatBookingTime(bookingDate);
  const subject = `New booking request: ${serviceName}`;

  return {
    subject,
    text: [
      `New booking request for ${brand.name}`,
      "",
      `Customer: ${customerName}`,
      `Email: ${customerEmail}`,
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
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Email</td><td style="padding: 6px 0;">${customerEmail}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Phone</td><td style="padding: 6px 0;">${phone}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Service</td><td style="padding: 6px 0;">${serviceName}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Date</td><td style="padding: 6px 0;">${dateLabel}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Time</td><td style="padding: 6px 0;">${timeLabel}</td></tr>
        </table>
      </div>
    `,
  };
}

function buildCustomerEmail({ customerName, phone, serviceName, bookingDate }) {
  const dateLabel = formatBookingDate(bookingDate);
  const timeLabel = formatBookingTime(bookingDate);

  return {
    subject: `${brand.shortName} booking request received`,
    text: [
      `Hello ${customerName},`,
      "",
      `Thank you for booking with ${brand.name}. Your service request has been received.`,
      "",
      `Service: ${serviceName}`,
      `Preferred date: ${dateLabel}`,
      `Preferred time: ${timeLabel}`,
      `Phone: ${phone}`,
      "",
      "A service advisor will review the request and confirm the final appointment details with you directly.",
      "",
      `Regards,`,
      brand.name,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <p style="margin: 0 0 12px;">Hello ${customerName},</p>
        <p style="margin: 0 0 16px;">Thank you for choosing ${brand.name}. Your booking request has been received and is now awaiting workshop confirmation.</p>
        <div style="border: 1px solid #d1d5db; border-radius: 12px; padding: 16px; margin: 0 0 16px;">
          <p style="margin: 0 0 8px; font-weight: 700;">Booking summary</p>
          <p style="margin: 0 0 4px;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 0 0 4px;"><strong>Date:</strong> ${dateLabel}</p>
          <p style="margin: 0 0 4px;"><strong>Time:</strong> ${timeLabel}</p>
          <p style="margin: 0;"><strong>Phone:</strong> ${phone}</p>
        </div>
        <p style="margin: 0 0 12px;">A service advisor will review the request and confirm the final appointment details with you directly.</p>
        <p style="margin: 0;">Regards,<br />${brand.name}</p>
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
  let businessNotificationSent = false;
  let customerNotificationSent = false;

  try {
    const businessResult = await resend.emails.send({
      from: config.from,
      to: [businessBookingEmail],
      subject: businessEmail.subject,
      text: businessEmail.text,
      html: businessEmail.html,
    });

    if (businessResult.error) {
      throw new Error(businessResult.error.message);
    }

    businessNotificationSent = true;
  } catch (error) {
    logEmailFailure("business-booking-notification", businessBookingEmail, error);
  }

  if (bookingDetails.customerEmail) {
    const customerEmail = buildCustomerEmail(bookingDetails);

    try {
      const customerResult = await resend.emails.send({
        from: config.from,
        to: [bookingDetails.customerEmail],
        subject: customerEmail.subject,
        text: customerEmail.text,
        html: customerEmail.html,
      });

      if (customerResult.error) {
        throw new Error(customerResult.error.message);
      }

      customerNotificationSent = true;
    } catch (error) {
      logEmailFailure("customer-booking-confirmation", bookingDetails.customerEmail, error);
    }
  }

  return {
    businessNotificationSent,
    customerNotificationSent,
  };
}
