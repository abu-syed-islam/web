"use server";

import { getSupabaseClient } from "@/lib/supabase/client";

export type NewsletterActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function subscribeNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const supabase = getSupabaseClient();

  try {
    // Check if email already exists (using maybeSingle to avoid error when no record found)
    const { data: existing, error: checkError } = await supabase
      .from("newsletter_subscriptions")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // If there's an error checking (e.g., table doesn't exist), show helpful message
    if (checkError) {
      console.error("Error checking newsletter subscription:", checkError);
      
      // If table doesn't exist, provide helpful message
      if (checkError.code === "PGRST116" || checkError.message?.includes("does not exist")) {
        return {
          status: "error",
          message: "Newsletter service is not yet configured. Please contact us directly.",
        };
      }
    }

    // If email already exists
    if (existing) {
      return {
        status: "success",
        message: "You're already subscribed! Thank you.",
      };
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from("newsletter_subscriptions")
      .insert({
        email,
        subscribed_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Failed to save newsletter subscription:", insertError);
      
      // Handle duplicate email error (race condition)
      if (insertError.code === "23505" || insertError.message?.includes("duplicate")) {
        return {
          status: "success",
          message: "You're already subscribed! Thank you.",
        };
      }
      
      // Handle table doesn't exist error
      if (insertError.code === "PGRST116" || insertError.message?.includes("does not exist")) {
        return {
          status: "error",
          message: "Newsletter service is not yet configured. Please contact us directly.",
        };
      }

      return {
        status: "error",
        message: "Something went wrong. Please try again later.",
      };
    }
  } catch (error) {
    console.error("Unexpected error in newsletter subscription:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  }

  return {
    status: "success",
    message: "Thank you for subscribing! We'll keep you updated.",
  };
}
