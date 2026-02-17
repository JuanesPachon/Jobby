export interface PublishedTask {
    id: number;
    creator_id: number;
    selected_user_id?: number | null;
    title: string;
    description: string;
    city: string;
    neighborhood?: string | null;
    duration_hours: number;
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
    duration_hours: number;
    salary: number;
    status: 'available' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
}

export interface Applicant {
    id: number;
    application_id: number;
    first_name: string;
    last_name: string;
    photo_url: string;
    applied_at: string;
    status: 'applied' | 'selected' | 'rejected' | 'withdrawn';
}

export interface TaskWithApplications {
    id: number;
    creator_id: number;
    selected_user_id?: number | null;
    title: string;
    description: string;
    city: string;
    neighborhood?: string | null;
    duration_hours: number;
    salary: string;
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
    data?: {
        tasks: PublishedTask[];
        total: number;
    };
}

export interface TaskWithApplicationsResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: TaskWithApplications;
}
