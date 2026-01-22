import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Mail, Phone, Building, Calendar, Eye } from 'lucide-react';
import type { Lead } from '@/types/content';

export const revalidate = 0;

async function getAllLeads() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return data as Lead[];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'contacted':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'qualified':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'converted':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    case 'closed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function AdminLeadsPage() {
  const leads = await getAllLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
        <p className="text-muted-foreground mt-1">
          Manage contact form submissions and leads.
        </p>
      </div>

      {leads.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No leads yet</h3>
            <p className="text-sm text-muted-foreground">
              Contact form submissions will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {lead.company}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(lead.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{lead.message}</p>
                  {lead.project_type && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Project Type:</strong> {lead.project_type}
                    </p>
                  )}
                  {lead.budget_range && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Budget:</strong> {lead.budget_range}
                    </p>
                  )}
                </div>

                {lead.notes && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{lead.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
