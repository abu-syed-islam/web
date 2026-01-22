'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TeamMember } from '@/types/content';

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data) {
          setTeamMembers(data as TeamMember[]);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);
  if (isLoading) {
    return null;
  }

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">Our Team</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Meet the team
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A talented group of designers, developers, and strategists dedicated
            to delivering exceptional results.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group h-full border-border/70 bg-card/80 text-center transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {member.image_url ? (
                      <div className="relative h-24 w-24 rounded-full overflow-hidden">
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    )}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                  <p className="mb-4 text-sm text-primary font-medium">
                    {member.role}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                  {(member.github_url || member.linkedin_url || member.email || member.twitter_url) && (
                    <div className="flex items-center justify-center gap-3">
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${member.name}'s GitHub`}
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
