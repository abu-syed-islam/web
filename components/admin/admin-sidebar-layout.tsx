"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function getUser() {
      const supabase = getSupabaseAdminClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/admin/blog",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "View Site",
      href: "/",
      icon: (
        <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  // Get user initial for avatar
  const getUserInitial = (email: string | undefined) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  // Get user display name (email prefix)
  const getUserDisplayName = (email: string | undefined) => {
    if (!email) return 'Admin';
    return email.split('@')[0];
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-neutral-800">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <AdminLogo /> : <AdminLogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => {
                const isActive = pathname === link.href || 
                  (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <SidebarLink 
                    key={idx} 
                    link={link}
                    className={cn(
                      isActive && "bg-neutral-200 dark:bg-neutral-700 rounded-md"
                    )}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {user && (
              <SidebarLink
                link={{
                  label: getUserDisplayName(user.email),
                  href: "#",
                  icon: (
                    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {getUserInitial(user.email)}
                    </div>
                  ),
                }}
              />
            )}
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center justify-start gap-2 group/sidebar py-2 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export const AdminLogo = () => {
  return (
    <Link
      href="/admin/blog"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Admin Panel
      </motion.span>
    </Link>
  );
};

export const AdminLogoIcon = () => {
  return (
    <Link
      href="/admin/blog"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
