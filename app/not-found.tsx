import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-2xl text-center">
        <Card className="border-border/70 bg-card/80 p-8 md:p-12">
          <div className="mb-6 text-6xl font-bold text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text md:text-8xl">
            404
          </div>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                View Portfolio
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
