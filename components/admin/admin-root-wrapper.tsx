"use client";

import { usePathname } from 'next/navigation';

interface AdminRootWrapperProps {
  children: React.ReactNode;
  showNavbar: boolean;
  showFooter: boolean;
}

export function AdminRootWrapper({ children, showNavbar, showFooter }: AdminRootWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // On admin pages, don't show navbar and footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // On regular pages, show navbar and footer
  return (
    <>
      {showNavbar && <>{/* Navbar will be rendered by parent */}</>}
      {children}
      {showFooter && <>{/* Footer will be rendered by parent */}</>}
    </>
  );
}
