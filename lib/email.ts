import { Resend } from "resend";
import { CONTACT_EMAIL, COMPANY_NAME } from "@/constants/company";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  try {
    // Send notification email to company
    const { data, error } = await resend.emails.send({
      from: "Website Contact <onboarding@resend.dev>", // Update with your verified domain
      to: CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            <p>You have received a new message from your website contact form:</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${message}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
              This email was sent from the ${COMPANY_NAME} website contact form.
            </p>
          </body>
        </html>
      `,
      replyTo: email,
    });

    if (error) {
      console.error("Failed to send email notification", error);
      return { success: false, error };
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: "Website Contact <onboarding@resend.dev>", // Update with your verified domain
      to: email,
      subject: `Thank you for contacting ${COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Thank you for reaching out!</h2>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you within one business day.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${message}</p>
            </div>
            
            <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/portfolio">portfolio</a> or check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/services">services</a>.</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Best regards,<br>
              The ${COMPANY_NAME} Team
            </p>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email", error);
    return { success: false, error };
  }
}
