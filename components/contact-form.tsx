"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitContact, type ContactActionState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const initialState: ContactActionState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Sending..." : "Send message"}
    </Button>
  );
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitContact, initialState);

  useEffect(() => {
    if (state.status === "success" && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 rounded-2xl border bg-card/80 p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Alex Morgan"
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Project details</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your product, timeline, and goals."
          rows={5}
          required
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>We typically respond within one business day.</p>
        <SubmitButton />
      </div>

      {state.status !== "idle" && (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-green-600" : "text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
