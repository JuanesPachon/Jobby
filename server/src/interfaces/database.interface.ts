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