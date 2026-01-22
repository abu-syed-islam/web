"use client";

import { usePathname } from 'next/navigation';
import { AuthGuard } from './auth-guard';

interface ConditionalAdminWrapperProps {
  children: React.ReactNode;
}

export function ConditionalAdminWrapper({ children }: ConditionalAdminWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Don't wrap login page with AuthGuard - just render children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin pages, wrap with AuthGuard
  return <AuthGuard>{children}</AuthGuard>;
}
