import { BookingForm } from '@/components/booking/booking-form';
import { COMPANY_NAME } from '@/constants/company';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: `Book a consultation or appointment with ${COMPANY_NAME}. Select a date and time that works for you.`,
};

export default function BookingPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm font-semibold text-primary">Book an Appointment</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Schedule a Consultation
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a date and time that works best for you. We'll confirm your appointment via email.
          </p>
        </div>

        <div className="rounded-2xl border bg-card/80 p-6 shadow-premium">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
