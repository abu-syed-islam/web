"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { subscribeNewsletter } from "@/app/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

const initialState = {
  status: "idle" as "idle" | "success" | "error",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? "Subscribing..." : "Subscribe"}
    </Button>
  );
}

export function NewsletterSignup({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);
  const [email, setEmail] = useState("");

  // Reset email on success
  useEffect(() => {
    if (state.status === "success" && email) {
      setEmail("");
    }
  }, [state.status, email]);

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        <form action={formAction} className="flex gap-2">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            aria-label="Email address"
          />
          <SubmitButton />
        </form>
        {state.status !== "idle" && (
          <div className="text-sm">
            {state.status === "success" ? (
              <p className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                {state.message}
              </p>
            ) : (
              <p className="text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {state.message}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Get the latest updates, articles, and insights delivered to your inbox.
      </p>
      <form action={formAction} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <SubmitButton />
        </div>
        {state.status !== "idle" && (
          <p
            className={`text-sm flex items-center gap-1 ${
              state.status === "success" ? "text-green-600" : "text-destructive"
            }`}
          >
            {state.status === "success" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {state.message}
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                {state.message}
              </>
            )}
          </p>
        )}
      </form>
    </div>
  );
}
