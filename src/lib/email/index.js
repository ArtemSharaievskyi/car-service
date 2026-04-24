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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSummaryRow(label, value) {
  return `
    <tr>
      <td style="padding: 15px 0; color: #96a3b3; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">${label}</td>
      <td style="padding: 15px 0 15px 18px; color: #f5f7fa; font-size: 15px; font-weight: 700; line-height: 1.45; text-align: right; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">${value}</td>
    </tr>
  `;
}

function buildBusinessEmail({ customerName, phone, serviceName, bookingDate }) {
  const dateLabel = formatBookingDate(bookingDate);
  const timeLabel = formatBookingTime(bookingDate);
  const safeCustomerName = escapeHtml(customerName);
  const safePhone = escapeHtml(phone);
  const safeServiceName = escapeHtml(serviceName);
  const safeDateLabel = escapeHtml(dateLabel);
  const safeTimeLabel = escapeHtml(timeLabel);
  const safeBrandName = escapeHtml(brand.name);
  const safeBrandInitials = escapeHtml(brand.initials);
  const safeTagline = escapeHtml(brand.tagline);
  const subject = `New Service Booking: ${serviceName}`;

  return {
    subject,
    text: [
      "New Service Booking",
      brand.name,
      "",
      `Customer: ${customerName}`,
      `Phone: ${phone}`,
      `Service: ${serviceName}`,
      `Date: ${dateLabel}`,
      `Time: ${timeLabel}`,
    ].join("\n"),
    html: `
      <div style="margin: 0; padding: 0; background: #04070b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; background: #04070b;">
          <tr>
            <td align="center" style="padding: 34px 16px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 560px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 0 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td width="54" style="width: 54px;">
                          <div style="width: 46px; height: 46px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; background: #0d141c; color: #9ccfff; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 800; line-height: 46px; text-align: center;">${safeBrandInitials}</div>
                        </td>
                        <td style="font-family: Arial, Helvetica, sans-serif;">
                          <div style="color: rgba(245, 247, 250, 0.68); font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;">${safeBrandName}</div>
                          <div style="margin-top: 5px; color: #f5f7fa; font-size: 16px; font-weight: 800; line-height: 1.35;">${safeTagline}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background: #0d141c; background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(77, 163, 255, 0.045)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34); overflow: hidden;">
                    <div style="height: 4px; background: #4da3ff; line-height: 4px;">&nbsp;</div>
                    <div style="padding: 30px 30px 10px; font-family: Arial, Helvetica, sans-serif;">
                      <div style="display: inline-block; margin: 0 0 14px; padding: 7px 12px; border: 1px solid rgba(77, 163, 255, 0.3); border-radius: 999px; background: rgba(77, 163, 255, 0.18); color: #9ccfff; font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;">Booking Notification</div>
                      <h1 style="margin: 0; color: #f5f7fa; font-size: 28px; line-height: 1.2; font-weight: 800;">New Service Booking</h1>
                      <p style="margin: 13px 0 0; color: #96a3b3; font-size: 15px; line-height: 1.7;">A customer submitted a new service request. Review the details below and follow up to confirm the appointment.</p>
                    </div>
                    <div style="padding: 16px 30px 30px;">
                      <div style="margin: 0 0 12px; color: #9ccfff; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;">Booking Summary</div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif;">
                        ${buildSummaryRow("Customer", safeCustomerName)}
                        ${buildSummaryRow("Phone", safePhone)}
                        ${buildSummaryRow("Service", safeServiceName)}
                        ${buildSummaryRow("Date", safeDateLabel)}
                        ${buildSummaryRow("Time", safeTimeLabel)}
                      </table>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 18px 12px 0; font-family: Arial, Helvetica, sans-serif; color: #96a3b3; font-size: 12px; line-height: 1.6;">
                    <span style="color: #f5f7fa; font-weight: 700;">${safeBrandName}</span><br />
                    Professional car service booking notification
                  </td>
                </tr>
              </table>
            </td>
          </tr>
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
  let businessNotificationSent = false;
  const customerNotificationSent = false;

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

  return {
    businessNotificationSent,
    customerNotificationSent,
  };
}
