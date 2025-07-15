import { Auth } from "./auth.interface.js";

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
}