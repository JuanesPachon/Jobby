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
