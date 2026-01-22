export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  created_at: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string | null;
  category?: string | null;
  tech_stack?: string[] | null;
  live_url?: string | null;
  github_url?: string | null;
  gallery_images?: string[] | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string | null;
  category: string | null;
  image_url: string | null;
  status: string;
  created_at: string | null;
  view_count?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating?: number | null;
  image_url?: string | null;
  featured?: boolean;
  display_order?: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url?: string | null;
  email?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  display_order?: number | null;
  is_active?: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  phone?: string | null;
  company?: string | null;
  project_type?: string | null;
  budget_range?: string | null;
  file_urls?: string[] | null;
  status: string;
  source?: string | null;
  notes?: string | null;
  created_at: string | null;
  updated_at: string | null;
};