export interface ResetPassword {
    id?: number;
    user_id: number;
    reset_code: number;
    expires_at: Date;
    created_at: Date;
    used_at?: Date;
}
