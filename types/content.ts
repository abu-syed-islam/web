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
  gif_url?: string | null;
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

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service_id?: string | null;
  booking_date: string;
  booking_time: string;
  duration_minutes?: number | null;
  message?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmation_token?: string | null;
  reminder_sent?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TimeSlot = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  project_id?: string | null;
  client_name?: string | null;
  client_logo_url?: string | null;
  image_url?: string | null;
  gallery_images?: string[] | null;
  challenges?: string[] | null;
  solutions?: string[] | null;
  results?: string[] | null;
  metrics?: Record<string, any> | null;
  tech_stack?: string[] | null;
  category?: string | null;
  duration?: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Video = {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  video_type: 'youtube' | 'vimeo';
  video_id: string;
  category?: string | null;
  duration?: number | null;
  display_order?: number | null;
  is_featured?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Resource = {
  id: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_name?: string | null;
  file_size?: number | null;
  file_type?: 'pdf' | 'doc' | 'template' | 'other' | null;
  category?: string | null;
  download_count?: number | null;
  is_featured?: boolean | null;
  display_order?: number | null;
  created_at: string | null;
  updated_at: string | null;
};