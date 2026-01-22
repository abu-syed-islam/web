import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText } from 'lucide-react';
import { AdminLogoutButton } from '@/components/admin/admin-logout-button';
import { AuthGuard } from '@/components/admin/auth-guard';
import { AdminUserInfo } from '@/components/admin/admin-user-info';
import { ConditionalAdminWrapper } from '@/components/admin/conditional-admin-wrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConditionalAdminWrapper>
      <div className="min-h-screen bg-muted/30">
        {/* Admin Navbar */}
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <Link href="/admin/blog" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span className="font-semibold">Admin Dashboard</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/admin/blog"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Blog Posts
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AdminUserInfo />
              <AdminLogoutButton />
              <Button asChild variant="outline" size="sm">
                <Link href="/">View Site</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container py-8 px-6">
          {children}
        </main>
      </div>
    </ConditionalAdminWrapper>
  );
}
