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