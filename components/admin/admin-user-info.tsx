"use client";

import { useEffect, useState } from 'react';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function AdminUserInfo() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = getSupabaseAdminClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    getUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="hidden sm:flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Logged in as:</span>
      <span className="font-medium">{user.email}</span>
    </div>
  );
}
