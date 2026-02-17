import { Auth } from './auth.interface.js';

export interface UserSkill {
    id: number;
    skill_name: string;
}

export interface UserDocument {
    id: number;
    file_url: string;
    uploaded_at: Date;
}

export interface UserExperience {
    id: number;
    title: string;
    company?: string;
    start_date?: Date;
    end_date?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface UserProfile {
    photo_url?: string;
    description?: string;
    occupation?: string;
    current_location?: string;
    mock_email?: string;
    created_at: Date;
    updated_at: Date;
}

export interface User extends Auth {
    id?: number;
    first_name: string;
    last_name: string;
    birth_date: Date;
    doc_type: 'cedula de ciudadania' | 'pasaporte' | 'cedula de extranjeria';
    doc_number: string;
    phone: string;
    oauth_provider: 'local' | 'google';
    oauth_provider_id?: string | null;
    avatar_url?: string | null;
    email_verified: boolean;
    accepted_terms: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
    profile?: UserProfile;
    experiences?: UserExperience[];
    skills?: UserSkill[];
    documents?: UserDocument[];
}
