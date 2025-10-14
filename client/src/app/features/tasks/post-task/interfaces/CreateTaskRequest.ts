export interface CreateTaskRequest {
  title: string;
  description: string;
  city: string;
  neighborhood?: string;
  duration_days: number;
  salary: number;
}