import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resolveIcon } from "@/lib/icon-map";
import type { Service } from "@/types/content";

type Props = {
  services: Service[];
  showViewAll?: boolean;
};

export default function ServicesPreview({ services, showViewAll }: Props) {
  return (
    <section className="w-full px-6 py-12 md:py-16" id="services">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">Services</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              What we ship
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              End-to-end delivery from discovery and design through production
              engineering. Built for SaaS teams that need quality, fast.
            </p>
          </div>
          {showViewAll && (
            <Button asChild variant="outline">
              <Link href="/services" className="flex items-center gap-2">
                View all services <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No services are published yet. Connect Supabase and add rows to
              the <code className="mx-1 rounded bg-muted px-1 py-0.5">services</code>{" "}
              table to showcase your offerings.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = resolveIcon(service.icon);
              return (
                <Card
                  key={service.id}
                  className="group border-border/70 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <CardHeader className="space-y-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
