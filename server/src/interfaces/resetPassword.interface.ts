export interface ResetPassword {
    id?: number;
    user_id: number;
    reset_code: number;
    expires_at: Date;
    created_at: Date;
    used_at?: Date;
}
export interface VerifyCodeRequest {
    resetCode: string;
}

export interface ResetPasswordRequest {
    newPassword: string;
}

export interface ResetTokenPayload {
    userId: number;
    purpose: string;
    iat: number;
    exp: number;
}
