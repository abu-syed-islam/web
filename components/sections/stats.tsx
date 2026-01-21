'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { value: 150, label: 'Projects Completed', suffix: '+' },
  { value: 80, label: 'Happy Clients', suffix: '+' },
  { value: 8, label: 'Years of Experience', suffix: '+' },
  { value: 99, label: 'Client Satisfaction', suffix: '%' },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const num = Math.round(latest);
        ref.current.textContent = num.toLocaleString();
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <>
      {prefix}
      <span ref={ref} className="tabular-nums">0</span>
      {suffix}
    </>
  );
}

export default function StatsSection() {
  return (
    <section className="w-full px-6 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center space-y-2"
            >
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
                {stat.suffix}
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
