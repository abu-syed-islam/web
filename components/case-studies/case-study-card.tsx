"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CaseStudy } from '@/types/content';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Link href={`/case-studies/${caseStudy.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {caseStudy.image_url && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={caseStudy.image_url}
              alt={caseStudy.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          {caseStudy.client_name && (
            <p className="text-sm font-medium text-primary">{caseStudy.client_name}</p>
          )}
          <h3 className="mt-2 text-xl font-semibold">{caseStudy.title}</h3>
          {caseStudy.excerpt && (
            <p className="mt-2 line-clamp-3 text-muted-foreground">{caseStudy.excerpt}</p>
          )}
          {caseStudy.tech_stack && caseStudy.tech_stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.tech_stack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {caseStudy.tech_stack.length > 3 && (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  +{caseStudy.tech_stack.length - 3} more
                </span>
              )}
            </div>
          )}
          <Button variant="ghost" className="mt-4 gap-2 group-hover:gap-3" asChild>
            <span>
              Read Case Study
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
