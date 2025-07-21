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