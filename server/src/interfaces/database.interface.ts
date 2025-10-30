import { User } from "./user.interface.js";
import { Application, ApplicationWithApplicantInfo, TaskWithApplications } from "./application.interface.js";

export interface DatabaseError extends Error {
    code?: string;
    errno?: number;
    sqlState?: string;
}

export interface RegisterResult {
    success: boolean;
    error?: 'duplicate' | 'server' | 'validation';
    message?: string;
}

export interface LoginResult {
    success: boolean;
    error?: 'invalid_credentials' | 'server';
    message?: string;
    user?: {
        id: number;
        email: string;
    };
}

export interface VerifyCodeResult {
    success: boolean;
    error?: 'invalid_code' | 'code_expired' | 'code_used' | 'user_not_found' | 'server';
    message?: string;
    userId?: number;
    resetId?: number;
}

export interface ResetPasswordResult {
    success: boolean;
    error?: 'user_not_found' | 'server' | 'validation';
    message?: string;
}

export interface getUserByIdResult {
    success: boolean;
    error?: 'user_not_found' | 'server';
    message?: string;
    user?: User;
}

export interface UpdateProfileResult {
    success: boolean;
    error?: 'user_not_found' | 'validation_error' | 'server';
    message?: string;
    data?: {
        updated_user?: boolean;
        updated_profile?: boolean;
        experiences_processed?: number;
        skills_processed?: number;
        documents_processed?: number;
        user?: User;
    };
}

export interface CreateTaskResult {
    success: boolean;
    error?: 'invalid_creator' | 'constraint_violation' | 'server';
    message?: string;
    data?: {
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
        created_at: Date;
        updated_at: Date;
    };
}

export interface GetTaskByIdResult {
    success: boolean;
    error?: 'task_not_found' | 'server';
    message?: string;
    task?: {
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
        created_at: Date;
        updated_at: Date;
        deleted_at?: Date | null;
        creator: {
            id: number;
            first_name: string | null;
            last_name: string | null;
            photo_url: string | null;
        };
        selected_user?: {
            id: number;
            first_name: string | null;
            last_name: string | null;
            photo_url: string | null;
        } | null;
    };
}

export interface GetTasksResult {
    success: boolean;
    error?: 'server';
    message?: string;
    data?: {
        tasks: {
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
            created_at: Date;
            updated_at: Date;
            creator: {
                id: number;
                first_name: string | null;
                last_name: string | null;
                photo_url: string | null;
            };
            selected_user?: {
                id: number;
                first_name: string | null;
                last_name: string | null;
                photo_url: string | null;
            } | null;
        }[];
        total: number;
    };
}

export interface CreateApplicationResult {
    success: boolean;
    error?: 'task_not_found' | 'task_not_available' | 'own_task' | 'already_applied' | 'server';
    message?: string;
    data?: Application;
}

export interface GetApplicationsByTaskResult {
    success: boolean;
    error?: 'task_not_found' | 'unauthorized' | 'server';
    message?: string;
    data?: ApplicationWithApplicantInfo[];
}

export interface GetUserTasksResult {
    success: boolean;
    error?: 'server';
    message?: string;
    data?: {
        tasks: {
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
            created_at: Date;
            updated_at: Date;
            applications_count: number;
        }[];
        total: number;
    };
}

export interface GetTaskWithApplicationsResult {
    success: boolean;
    error?: 'task_not_found' | 'unauthorized' | 'server';
    message?: string;
    data?: TaskWithApplications;
}

export interface SelectApplicantResult {
    success: boolean;
    error?: 'task_not_found' | 'unauthorized' | 'applicant_not_found' | 'task_not_available' | 'already_selected' | 'server';
    message?: string;
    data?: {
        task_id: number;
        selected_user_id: number;
        task_status: 'available' | 'in_progress';
        application_status: 'selected';
        updated_at: Date;
    };
}

export interface DeselectApplicantResult {
    success: boolean;
    error?: 'task_not_found' | 'unauthorized' | 'task_not_available' | 'already_selected' | 'applicant_not_found' | 'server';
    message?: string;
    data?: {
        task_id: number;
        task_status: 'available';
        updated_at: Date;
    };
}

export interface StartTaskResult {
    success: boolean;
    error?: 'task_not_found' | 'unauthorized' | 'task_not_available' | 'already_selected' | 'server';
    message?: string;
    data?: {
        task_id: number;
        selected_user_id: number;
        task_status: 'in_progress';
        updated_at: Date;
    };
}

export interface CancelTaskResult {
    success: boolean;
    error?: 'task_not_found' | 'unauthorized' | 'task_not_cancellable' | 'has_selected_applicant' | 'server';
    message?: string;
    data?: {
        task_id: number;
        task_status: 'cancelled';
        updated_at: Date;
    };
}

export interface GetUserApplicationsResult {
    success: boolean;
    error?: 'server';
    message?: string;
    data?: {
        tasks: {
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
            created_at: Date;
            updated_at: Date;
            creator: {
                id: number;
                first_name: string;
                last_name: string;
                photo_url?: string | null;
            };
            application_status: 'applied' | 'selected' | 'withdrawn';
            user_relation_status: 'applied' | 'selected' | 'in_progress' | 'completed' | 'cancelled';
            applied_at: Date;
            status_changed_at?: Date | null;
        }[];
        total: number;
        currentPage: number;
        totalPages: number;
    };
}