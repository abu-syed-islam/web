import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your appointment has been successfully booked.',
};

export default function BookingSuccessPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-md px-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Booking Confirmed!
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">
          Your appointment has been successfully booked. We've sent a confirmation email with all the details.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
