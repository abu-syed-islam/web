"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-semibold">Something went wrong!</h1>
        <p className="mb-6 text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
