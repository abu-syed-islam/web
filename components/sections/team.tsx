'use client';

import { motion } from 'motion/react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Alex Morgan',
    role: 'Lead Developer',
    bio: 'Full-stack engineer with 10+ years of experience building scalable web applications. Passionate about clean code and modern technologies.',
    social: {
      github: '#',
      linkedin: '#',
      email: 'alex@example.com',
    },
  },
  {
    name: 'Sarah Chen',
    role: 'UX Designer',
    bio: 'Creative designer focused on creating intuitive user experiences. Specializes in design systems and accessibility.',
    social: {
      github: '#',
      linkedin: '#',
      email: 'sarah@example.com',
    },
  },
  {
    name: 'Mike Johnson',
    role: 'DevOps Engineer',
    bio: 'Cloud infrastructure expert with deep knowledge in AWS, containerization, and CI/CD pipelines. Ensures reliable and scalable deployments.',
    social: {
      github: '#',
      linkedin: '#',
      email: 'mike@example.com',
    },
  },
  {
    name: 'Emily Davis',
    role: 'Project Manager',
    bio: 'Experienced project manager who ensures smooth delivery and communication. Bridges the gap between technical teams and clients.',
    social: {
      linkedin: '#',
      email: 'emily@example.com',
    },
  },
];

export default function TeamSection() {
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
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                  <p className="mb-4 text-sm text-primary font-medium">
                    {member.role}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                  {member.social && (
                    <div className="flex items-center justify-center gap-3">
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${member.name}'s GitHub`}
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
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
