import { Mail, MapPin, PhoneCall } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { COMPANY_NAME, CONTACT_EMAIL } from "@/constants/company";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: PhoneCall,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote-first / Global",
  },
];

export default function ContactPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Contact</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Start a project with {COMPANY_NAME}
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your goals and we’ll follow up with a tailored plan
              and timeline. No sales fluff—just a clear path to shipping.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border bg-muted/40 p-6">
            <p className="text-sm font-semibold text-foreground">How we work</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Discovery call to align on scope and outcomes.</li>
              <li>Proposal with milestones, team mix, and pricing.</li>
              <li>Kickoff within two weeks of approval.</li>
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border bg-card/60 px-4 py-3"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-foreground">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
