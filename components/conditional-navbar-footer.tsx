"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/ui/footer-section';

interface ConditionalNavbarFooterProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export function ConditionalNavbarFooter({ children, navbar, footer }: ConditionalNavbarFooterProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // On admin pages, don't show Navbar and Footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // On regular pages, show Navbar, content, and Footer with gradient background
  return (
    <div className="relative flex min-h-screen flex-col bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_25%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.05),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.05),transparent_25%)]">
      {navbar}
      {children}
      {footer}
    </div>
  );
}
