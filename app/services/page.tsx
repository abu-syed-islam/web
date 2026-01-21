import ServicesPreview from "@/components/sections/services-preview";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Service } from "@/types/content";

export const revalidate = 120;

async function getServices() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("services")
    .select("id,title,description,icon,created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6 pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="text-sm font-semibold text-primary">Services</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          Full-stack product delivery
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          From strategic discovery and UX to production-ready web applications.
          We plug into your team to ship quality software on a predictable
          cadence.
        </p>
      </div>

      <ServicesPreview services={services as Service[]} />
    </div>
  );
}
