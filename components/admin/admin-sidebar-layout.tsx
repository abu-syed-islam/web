"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Home, LogOut, Briefcase, Sparkles, Users, MessageSquare, Mail } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function AdminSidebarContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
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
        <LayoutDashboard className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: (
        <FileText className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "Services",
      href: "/admin/services",
      icon: (
        <Sparkles className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: (
        <Briefcase className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: (
        <MessageSquare className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "Team",
      href: "/admin/team",
      icon: (
        <Users className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "Leads",
      href: "/admin/leads",
      icon: (
        <Mail className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      ),
    },
    {
      label: "View Site",
      href: "/",
      icon: (
        <Home className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
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
    <>
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {open ? <AdminLogo /> : <AdminLogoIcon />}
        <div className="mt-8 flex flex-col gap-1">
          {links.map((link, idx) => {
            const isActive = pathname === link.href || 
              (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <SidebarLink 
                key={idx} 
                link={{
                  ...link,
                  icon: (
                    <div className={cn(
                      "rounded-lg transition-all duration-200 flex items-center justify-center",
                      open ? "p-2" : "p-1.5",
                      isActive 
                        ? "bg-primary/10 text-primary dark:bg-primary/20" 
                        : "text-neutral-600 dark:text-neutral-400 group-hover/sidebar:bg-neutral-200 dark:group-hover/sidebar:bg-neutral-700 group-hover/sidebar:text-neutral-900 dark:group-hover/sidebar:text-neutral-100"
                    )}>
                      {React.cloneElement(link.icon as React.ReactElement, {
                        className: cn(
                          open ? "h-5 w-5" : "h-4 w-4",
                          isActive && "text-primary"
                        )
                      })}
                    </div>
                  )
                }}
                className={cn(
                  "rounded-lg transition-all duration-200 flex items-center",
                  open ? "px-2 py-1.5" : "px-0 py-1.5 justify-center",
                  isActive && "bg-primary/5 dark:bg-primary/10"
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
                <div className={cn(
                  "flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-semibold shadow-sm ring-2 ring-primary/20 dark:ring-primary/30",
                  open ? "h-8 w-8 text-sm" : "h-7 w-7 text-xs"
                )}>
                  {getUserInitial(user.email)}
                </div>
              ),
            }}
            className={cn(
              "rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200",
              open ? "px-2 py-1.5" : "px-0 py-1.5 justify-center"
            )}
          />
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200",
            open ? "justify-start gap-2 px-2 py-1.5" : "justify-center px-0 py-1.5"
          )}
        >
          <div className={cn(
            "rounded-lg transition-all duration-200 flex items-center justify-center",
            open ? "p-2" : "p-1.5",
            "group-hover/sidebar:bg-red-100 dark:group-hover/sidebar:bg-red-900/30"
          )}>
            <LogOut className={cn(
              "flex-shrink-0",
              open ? "h-5 w-5" : "h-4 w-4"
            )} />
          </div>
          <motion.span
            animate={{
              display: open ? "inline-block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 font-medium"
          >
            Logout
          </motion.span>
        </button>
      </div>
    </>
  );
}

export function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-neutral-800">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <AdminSidebarContent>{children}</AdminSidebarContent>
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
      className="font-normal flex space-x-3 items-center text-sm text-black dark:text-white py-2 relative z-20 group/logo transition-all duration-200 hover:opacity-80"
    >
      <div className="h-6 w-7 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 shadow-sm ring-1 ring-primary/20 dark:ring-primary/30 transition-all duration-200 group-hover/logo:scale-105" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-black dark:text-white whitespace-pre text-base"
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
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-2 relative z-20 group/logo transition-all duration-200 hover:opacity-80"
    >
      <div className="h-6 w-7 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 shadow-sm ring-1 ring-primary/20 dark:ring-primary/30 transition-all duration-200 group-hover/logo:scale-105" />
    </Link>
  );
};
