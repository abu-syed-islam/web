"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase/client";
import { sendContactNotification } from "@/lib/email";

export type ContactActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in all fields." };
  }

  if (message.length < 10) {
    return {
      status: "error",
      message: "Tell us a bit more about your project (10+ characters).",
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("Failed to save contact message", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // Send email notifications (non-blocking)
  sendContactNotification({ name, email, message }).catch((err) => {
    console.error("Failed to send email notification", err);
    // Don't fail the form submission if email fails
  });

  revalidatePath("/contact");

  return {
    status: "success",
    message: "Thanks for reaching out! We'll respond within one business day.",
  };
}
