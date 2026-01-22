import { Resend } from "resend";
import { CONTACT_EMAIL, COMPANY_NAME } from "@/constants/company";
import type { Booking } from "@/types/content";
import { formatBookingDateTime } from "./booking";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmation(booking: Booking, serviceName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const bookingDateTime = formatBookingDateTime(booking.booking_date, booking.booking_time);
    const confirmationLink = booking.confirmation_token
      ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/booking/confirm?token=${booking.confirmation_token}`
      : null;

    const { data, error } = await resend.emails.send({
      from: "Website Booking <onboarding@resend.dev>", // Update with your verified domain
      to: booking.email,
      subject: `Booking Confirmation - ${COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Booking Confirmed!</h2>
            <p>Hi ${booking.name},</p>
            <p>Thank you for booking with ${COMPANY_NAME}. Your appointment has been confirmed.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">Booking Details</h3>
              ${serviceName ? `<p><strong>Service:</strong> ${serviceName}</p>` : ''}
              <p><strong>Date & Time:</strong> ${bookingDateTime}</p>
              ${booking.duration_minutes ? `<p><strong>Duration:</strong> ${booking.duration_minutes} minutes</p>` : ''}
              ${booking.message ? `<p><strong>Message:</strong><br>${booking.message}</p>` : ''}
            </div>

            ${confirmationLink ? `
              <p style="margin-top: 20px;">
                <a href="${confirmationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  View Booking Details
                </a>
              </p>
            ` : ''}

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              If you need to reschedule or cancel, please contact us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
            </p>
            
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
              Best regards,<br>
              The ${COMPANY_NAME} Team
            </p>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send booking confirmation email", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send booking confirmation email", error);
    return { success: false, error };
  }
}

/**
 * Send booking notification email to admin
 */
export async function sendBookingNotification(booking: Booking, serviceName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const bookingDateTime = formatBookingDateTime(booking.booking_date, booking.booking_time);

    const { data, error } = await resend.emails.send({
      from: "Website Booking <onboarding@resend.dev>", // Update with your verified domain
      to: CONTACT_EMAIL,
      subject: `New Booking: ${booking.name} - ${bookingDateTime}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Booking Received</h2>
            <p>You have received a new booking request:</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">Customer Information</h3>
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></p>
              ${booking.phone ? `<p><strong>Phone:</strong> <a href="tel:${booking.phone}">${booking.phone}</a></p>` : ''}
              
              <h3 style="margin-top: 20px; color: #2563eb;">Booking Details</h3>
              ${serviceName ? `<p><strong>Service:</strong> ${serviceName}</p>` : ''}
              <p><strong>Date & Time:</strong> ${bookingDateTime}</p>
              ${booking.duration_minutes ? `<p><strong>Duration:</strong> ${booking.duration_minutes} minutes</p>` : ''}
              <p><strong>Status:</strong> ${booking.status}</p>
              ${booking.message ? `<p><strong>Message:</strong><br>${booking.message}</p>` : ''}
            </div>

            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
              This email was sent from the ${COMPANY_NAME} website booking system.
            </p>
          </body>
        </html>
      `,
      replyTo: booking.email,
    });

    if (error) {
      console.error("Failed to send booking notification email", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send booking notification email", error);
    return { success: false, error };
  }
}

/**
 * Send booking reminder email (24 hours before)
 */
export async function sendBookingReminder(booking: Booking, serviceName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const bookingDateTime = formatBookingDateTime(booking.booking_date, booking.booking_time);

    const { data, error } = await resend.emails.send({
      from: "Website Booking <onboarding@resend.dev>", // Update with your verified domain
      to: booking.email,
      subject: `Reminder: Your Appointment Tomorrow - ${COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Appointment Reminder</h2>
            <p>Hi ${booking.name},</p>
            <p>This is a friendly reminder about your upcoming appointment with ${COMPANY_NAME}.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">Appointment Details</h3>
              ${serviceName ? `<p><strong>Service:</strong> ${serviceName}</p>` : ''}
              <p><strong>Date & Time:</strong> ${bookingDateTime}</p>
              ${booking.duration_minutes ? `<p><strong>Duration:</strong> ${booking.duration_minutes} minutes</p>` : ''}
            </div>

            <p style="margin-top: 20px;">
              If you need to reschedule or cancel, please contact us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> as soon as possible.
            </p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              We look forward to seeing you!<br>
              The ${COMPANY_NAME} Team
            </p>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send booking reminder email", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send booking reminder email", error);
    return { success: false, error };
  }
}
