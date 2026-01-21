'use client';

import { motion } from 'motion/react';
import {
  Code2,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Palette,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TechCategory {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  technologies: string[];
}

const techCategories: TechCategory[] = [
  {
    icon: Code2,
    title: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    icon: Database,
    title: 'Backend',
    technologies: ['Node.js', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs'],
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    technologies: ['AWS', 'Vercel', 'Docker', 'CI/CD', 'Kubernetes'],
  },
  {
    icon: Smartphone,
    title: 'Mobile',
    technologies: ['React Native', 'Flutter', 'PWA', 'Responsive Design'],
  },
  {
    icon: Globe,
    title: 'Full-Stack',
    technologies: ['Next.js', 'Serverless', 'Microservices', 'API Design'],
  },
  {
    icon: Shield,
    title: 'Security',
    technologies: ['OAuth', 'JWT', 'SSL/TLS', 'Security Audits'],
  },
  {
    icon: Zap,
    title: 'Performance',
    technologies: ['CDN', 'Caching', 'Optimization', 'Monitoring'],
  },
  {
    icon: Palette,
    title: 'Design Tools',
    technologies: ['Figma', 'Adobe XD', 'Design Systems', 'Prototyping'],
  },
];

export default function TechStackSection() {
  return (
    <section className="w-full px-6 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">Technology Stack</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Technologies we work with
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We use modern, proven technologies to build scalable and
            maintainable web applications.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {techCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="group h-full border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-premium">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/15 group-hover:ring-primary/30 group-hover:scale-110">
                      <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-4 text-lg font-semibold transition-colors duration-200 group-hover:text-primary">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/90 before:content-['▹'] before:mr-2 before:text-primary"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
