export interface PublishedTask {
  id: number;
  creator_id: number;
  selected_user_id?: number | null;
  title: string;
  description: string;
  city: string;
  neighborhood?: string | null;
  duration_days: number;
  salary: number;
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  applications_count: number;
}

export interface TaskDetail {
  id: number;
  creator_id: number;
  selected_user_id?: number | null;
  title: string;
  description: string;
  city: string;
  neighborhood?: string | null;
  duration_days: number;
  salary: number;
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Applicant {
  id: number;
  application_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  photo_url: string;
  applied_at: string;
  status: 'applied' | 'selected' | 'rejected';
}

export interface TaskWithApplications {
  id: number;
  creator_id: number;
  selected_user_id?: number | null;
  title: string;
  description: string;
  city: string;
  neighborhood?: string | null;
  duration_days: number;
  salary: string; // El backend devuelve como string
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  selected_user?: any;
  applications: Applicant[];
}

export interface PublishedTasksResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: PublishedTask[];
}

export interface TaskWithApplicationsResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: TaskWithApplications;
}