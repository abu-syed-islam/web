'use client';

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { COMPANY_NAME } from "@/constants/company";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use logo.png for dark theme, day-theam-logo.png for light theme
  const logoSrc = mounted && resolvedTheme === 'dark' ? '/logo.png' : '/day-theam-logo.png';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium glass effect with clean backdrop */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/40 backdrop-blur-md backdrop-saturate-200 border-b border-border/40 dark:border-border/20">
        {/* Subtle glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent dark:from-white/0" />
        {/* Bottom border highlight for premium look */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold transition-all duration-200 hover:opacity-80"
        >
          <div className="relative flex h-10 w-auto items-center justify-center">
            <Image
              src={logoSrc}
              alt={`${COMPANY_NAME} Logo`}
              width={120}
              height={40}
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              priority
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-4 py-2 rounded-md transition-all duration-200 hover:text-foreground"
            >
              <span className="relative z-10">{link.label}</span>
              {/* Clean hover background effect */}
              <span className="absolute inset-0 rounded-md bg-muted/50 dark:bg-muted/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button 
            asChild
            className="group relative overflow-hidden transition-all duration-200 hover:opacity-90"
          >
            <Link href="/contact" className="flex items-center gap-1.5">
              <span className="relative z-10">Let&apos;s talk</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </div>

        <div className="block md:hidden">
          <Button 
            asChild 
            size="sm" 
            variant="outline"
            className="transition-all duration-200 hover:opacity-90"
          >
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
