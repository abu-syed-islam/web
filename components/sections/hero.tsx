import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { COMPANY_NAME, SITE_DESCRIPTION } from "@/constants/company";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 px-6 pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-10">
        <div className="flex items-center gap-3 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm">
          <Sparkles className="h-4 w-4" />
          Building modern web experiences
        </div>

        <div className="grid w-full gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              {COMPANY_NAME}
              <span className="block text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
                launches products faster with better code.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">{SITE_DESCRIPTION}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact" className="flex items-center gap-2">
                  Start a project <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/portfolio">View portfolio</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {["Product strategy", "Design systems", "Full-stack delivery"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 px-3 py-1"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/20 blur-3xl" />
            <div className="relative rounded-3xl border bg-card/80 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Delivery snapshot
                </p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  In progress
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Frontend velocity", value: "92%" },
                  { label: "API uptime", value: "99.9%" },
                  { label: "Release cadence", value: "Weekly" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3"
                  >
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
