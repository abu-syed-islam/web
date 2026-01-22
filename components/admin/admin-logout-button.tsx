"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { getSupabaseAdminClient } from '@/lib/supabase/client';

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.auth.signOut();
      
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">{isLoading ? 'Logging out...' : 'Logout'}</span>
    </Button>
  );
}
