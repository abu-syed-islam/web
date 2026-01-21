'use client';

import { motion } from 'motion/react';
import {
  Search,
  Palette,
  Code,
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProcessStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
}

const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Understanding your goals and requirements',
    details: [
      'Initial consultation and needs assessment',
      'Requirements gathering and analysis',
      'Project scope definition',
      'Timeline and milestone planning',
    ],
  },
  {
    icon: Palette,
    title: 'Design',
    description: 'Creating wireframes and visual designs',
    details: [
      'User experience (UX) research',
      'Wireframing and prototyping',
      'Visual design and branding',
      'Design system creation',
    ],
  },
  {
    icon: Code,
    title: 'Development',
    description: 'Building and testing your solution',
    details: [
      'Agile development sprints',
      'Regular progress updates',
      'Quality assurance testing',
      'Performance optimization',
    ],
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Deployment and handover',
    details: [
      'Final testing and bug fixes',
      'Production deployment',
      'Training and documentation',
      'Ongoing support setup',
    ],
  },
];

export default function ProcessSection() {
  return (
    <section className="w-full px-6 py-12 md:py-16 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">Our Process</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            How we work
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A proven four-phase approach that ensures quality, transparency, and
            successful project delivery.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  <div
                    className={`flex flex-col lg:flex-row items-center gap-8 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Desktop: Card on left/right */}
                    <div
                      className={`w-full lg:w-5/12 ${isEven ? 'lg:mr-auto' : 'lg:ml-auto'}`}
                    >
                      <Card className="border-border/70 bg-card/80 h-full transition hover:border-primary/40 hover:shadow-lg">
                        <CardHeader className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Icon className="h-7 w-7" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-primary">
                                  STEP {index + 1}
                                </span>
                              </div>
                              <CardTitle className="mt-1 text-2xl">
                                {step.title}
                              </CardTitle>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <li
                                key={detailIndex}
                                className="flex items-start gap-3 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Desktop: Timeline connector */}
                    <div className="hidden lg:flex absolute left-1/2 items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary -translate-x-1/2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>

                    {/* Mobile: Number indicator */}
                    <div className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary text-primary font-bold">
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
