'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    content:
      'Working with Flinkeo transformed our online presence. Their team delivered a beautiful, performant website that exceeded our expectations. The attention to detail and communication throughout the project was exceptional.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'InnovateLabs',
    content:
      'The development team at Flinkeo is incredibly skilled. They built our web application quickly without compromising on quality. The codebase is clean, well-documented, and maintainable.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'GreenTech Solutions',
    content:
      'Flinkeo helped us launch our e-commerce platform ahead of schedule. Their expertise in modern web technologies and user experience design is evident in every aspect of the final product.',
    rating: 5,
  },
  {
    id: '4',
    name: 'David Park',
    role: 'CTO',
    company: 'DataFlow Systems',
    content:
      'We needed a complex dashboard with real-time data visualization. Flinkeo delivered a robust solution that our team and clients love. Their ongoing support has been invaluable.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

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
          <Card className="border-border/70 bg-card/80 shadow-lg">
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
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
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
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
