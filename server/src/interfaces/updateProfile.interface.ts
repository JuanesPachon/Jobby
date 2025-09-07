export interface UpdateProfileRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    education: string;
    current_location: string;
    description?: string;
    experiences?: ExperienceOperation[];
    skills?: SkillOperation[];
    documents?: DocumentOperation[];
}

export interface ExperienceOperation {
    action: 'add' | 'update' | 'delete';
    id?: number;
    title?: string;
    company?: string;
    start_date?: string;
    end_date?: string;
}

export interface SkillOperation {
    action: 'add' | 'delete';
    skill_name: string;
    id?: number;
}

export interface DocumentOperation {
    action: 'add' | 'delete';
    id?: number;
    file_url?: string;
}
