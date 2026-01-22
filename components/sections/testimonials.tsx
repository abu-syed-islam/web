'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Testimonial } from '@/types/content';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('featured', true)
          .order('display_order', { ascending: true })
          .limit(10);

        if (!error && data) {
          setTestimonials(data as Testimonial[]);
          // Reset currentIndex when testimonials are loaded
          setCurrentIndex(0);
        } else {
          setTestimonials([]);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
        setCurrentIndex(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Ensure currentIndex is always valid when testimonials change
  useEffect(() => {
    if (testimonials.length > 0 && currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    if (testimonials.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    if (testimonials.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    if (testimonials.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex(Math.max(0, Math.min(index, testimonials.length - 1)));
  };

  if (isLoading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="w-full px-6 py-12 md:py-16 bg-muted/30" id="testimonials">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">Testimonials</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            What our clients say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Don't just take our word for it. Here's what our clients have to say
            about working with us.
          </p>
        </div>

        <div className="relative">
          <Card className="border-border/70 bg-card/80 shadow-premium transition-all duration-300 hover:shadow-premium-lg">
            <CardContent className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Quote className="h-10 w-10 text-primary/20" />
                  <p className="text-lg md:text-xl text-foreground leading-relaxed">
                    "{currentTestimonial.content}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-semibold text-foreground">
                        {currentTestimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.role}, {currentTestimonial.company}
                      </p>
                    </div>
                    {currentTestimonial.rating && (
                      <div className="flex gap-1">
                        {Array.from({ length: currentTestimonial.rating }).map(
                          (_, i) => (
                            <span key={i} className="text-yellow-400">
                              ★
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
              className="transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-primary ring-2 ring-primary/20'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:w-3'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              aria-label="Next testimonial"
              className="transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
