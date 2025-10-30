export interface AppliedTask {
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
  application_status: string;
  applied_at?: string;
  status_changed_at?: string;
  user_relation_status: 'applied' | 'selected' | 'in_progress' | 'completed' | 'cancelled';
}
