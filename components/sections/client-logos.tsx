'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface Client {
  name: string;
  logo?: string;
  placeholder?: string;
}

const clients: Client[] = [
  { name: 'TechStart Inc.', placeholder: 'TS' },
  { name: 'InnovateLabs', placeholder: 'IL' },
  { name: 'GreenTech Solutions', placeholder: 'GS' },
  { name: 'DataFlow Systems', placeholder: 'DF' },
  { name: 'CloudScale', placeholder: 'CS' },
  { name: 'Digital Ventures', placeholder: 'DV' },
];

export default function ClientLogosSection() {
  return (
    <section className="w-full px-6 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">Our Clients</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Trusted by innovative companies
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We've had the privilege of working with forward-thinking companies
            across various industries.
          </p>
        </div>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          <div className="flex w-max animate-scroll-left group-hover:paused" style={{ '--animation-duration': '40s' }}>
            {[...clients, ...clients].map((client, index) => (
              <motion.div
                key={`${client.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex items-center justify-center min-w-[180px] sm:min-w-[200px] lg:min-w-[240px] px-4"
              >
                <div className="group relative flex h-20 w-full items-center justify-center rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-premium hover:scale-105">
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={120}
                      height={40}
                      className="h-auto w-full object-contain opacity-60 transition-opacity group-hover:opacity-100"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-lg font-bold text-muted-foreground transition-colors group-hover:text-primary">
                        {client.placeholder}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {client.name}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
