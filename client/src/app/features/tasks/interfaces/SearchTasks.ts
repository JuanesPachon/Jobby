export interface SearchFilters {
  position?: string;
  city?: string;
  limit?: number;
  page?: number;
}

export interface Task {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  city: string;
  neighborhood?: string;
  duration_days: number;
  salary: number;
  status: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
    photo_url?: string;
  };
}

export interface SearchTasksResponse {
  success: boolean;
  message?: string;
  data?: {
    tasks: Task[];
    total: number;
  };
}