import { ConditionalAdminWrapper } from '@/components/admin/conditional-admin-wrapper';
import { AdminSidebarLayout } from '@/components/admin/admin-sidebar-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConditionalAdminWrapper>
      <AdminSidebarLayout>
        {children}
      </AdminSidebarLayout>
    </ConditionalAdminWrapper>
  );
}
