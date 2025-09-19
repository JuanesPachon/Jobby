export interface Application {
  id?: number;
  task_id: number;
  applicant_id: number;
  applied_at?: Date;
  status?: 'applied' | 'withdrawn' | 'selected' | 'completed';
  status_changed_at?: Date;
}

export interface CreateApplicationRequest {
  task_id: number;
}

export interface ApplicationWithApplicantInfo {
  id: number;
  task_id: number;
  applicant_id: number;
  applied_at: Date;
  status: 'applied' | 'withdrawn' | 'selected' | 'completed';
  status_changed_at: Date;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface SelectedUserInfo {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface TaskWithApplications {
  id: number;
  creator_id: number;
  selected_user_id?: number | null;
  title: string;
  description: string;
  city: string;
  neighborhood?: string;
  duration_days: number;
  salary: number;
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  applications: ApplicationWithApplicantInfo[];
  selected_user?: SelectedUserInfo | null;
}