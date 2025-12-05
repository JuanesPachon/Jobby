export interface Task {
  id?: number;
  creator_id: number;
  selected_user_id?: number | null;
  title: string;
  description: string;
  city: string;
  neighborhood?: string;
  duration_hours: number;
  salary: number;
  status?: 'available' | 'in_progress' | 'completed' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  city: string;
  neighborhood?: string;
  duration_hours: number;
  salary: number;
}

export interface GetTasksFilters {
  position?: string; 
  city?: string; 
  limit?: number; 
  page?: number;
  excludeOwnTasks?: boolean;
  currentUserId?: number;
}

export interface GetUserTasksFilters {
  limit?: number; 
  page?: number;
  status?: 'available' | 'in_progress' | 'completed' | 'cancelled';
}

export interface GetUserApplicationsFilters {
  limit?: number; 
  page?: number;
  status?: 'applied' | 'selected' | 'in_progress' | 'completed' | 'cancelled';
}

export interface SelectApplicantRequest {
  applicant_id: number;
}
