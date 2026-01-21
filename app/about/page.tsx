import { BadgeCheck, Globe2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANY_NAME } from "@/constants/company";
import ProcessSection from "@/components/sections/process";
import TeamSection from "@/components/sections/team";

const pillars = [
  {
    title: "Mission",
    icon: Globe2,
    description:
      "Ship reliable, inclusive web experiences that help teams move faster and delight their customers.",
  },
  {
    title: "Vision",
    icon: BadgeCheck,
    description:
      "Build a world where every digital product feels effortless to use and effortless to maintain.",
  },
  {
    title: "Team",
    icon: Users,
    description:
      "A multidisciplinary crew of designers and engineers who care about craft, outcomes, and collaboration.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary">About us</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            The product team behind {COMPANY_NAME}
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            We blend strategy, design, and engineering to build modern web
            products. Our team has led launches for venture-backed startups and
            enterprise SaaS platforms, always with a focus on accessibility,
            performance, and maintainable architecture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card
              key={pillar.title}
              className="border-border/70 bg-card/80 shadow-sm"
            >
              <CardHeader className="space-y-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <pillar.icon className="h-5 w-5" />
                </span>
                <CardTitle>{pillar.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>How we work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We join teams as an embedded product squad or as an autonomous
                delivery unit. Weekly releases, transparent demos, and
                thoughtful documentation keep stakeholders aligned.
              </p>
              <p>
                Every engagement starts with a quick discovery to define
                success, user journeys, and technical constraints. From there we
                design, build, and iterate with clear milestones and KPIs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>What to expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc space-y-2 pl-5">
                <li>Design systems that scale across products.</li>
                <li>Performance budgets baked into engineering.</li>
                <li>Accessible experiences that meet WCAG standards.</li>
                <li>Cloud architectures ready for growth and observability.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <ProcessSection />

        <TeamSection />
      </div>
    </div>
  );
}
