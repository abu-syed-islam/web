"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-2 text-2xl font-semibold">Something went wrong!</h1>
            <p className="mb-6 text-muted-foreground">
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
