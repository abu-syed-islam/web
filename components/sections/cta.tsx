import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { COMPANY_NAME } from "@/constants/company";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="w-full px-6 pb-16">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 px-8 py-12 shadow-lg md:px-12 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Let&apos;s talk</p>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
              Build the next thing with {COMPANY_NAME}
            </h3>
            <p className="max-w-2xl text-muted-foreground">
              Tell us about your product roadmap or a single feature. We&apos;ll
              craft a delivery plan with timelines, team mix, and measurable
              outcomes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact" className="flex items-center gap-2">
                Book a call <PhoneCall className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services" className="flex items-center gap-2">
                Explore services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
