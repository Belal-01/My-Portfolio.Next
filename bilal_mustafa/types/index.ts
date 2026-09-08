export type ProjectCategory = 'frontend' | 'devops' | 'cybersecurity';
export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  challenge?: string | null;
  solution?: string | null;
  categories: ProjectCategory[];
  tech_stack: string[];
  cover_image: string;
  architecture_diagram?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  video_demo_url?: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string | null;
  display_order: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string | null;
  badge_image?: string | null;
  credential_url?: string | null;
  skills_acquired: string[];
  created_at: string;
}

export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Resume {
  id: string;
  file_name: string;
  file_url: string;
  file_size?: number | null;
  is_active: boolean;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  mode?: string;
}
