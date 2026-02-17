export interface Auth {
    email: string;
    password: string | null;
}

export interface AuthenticatedRequest extends Request {
    user?: {
        sub: string;
        iat: number;
    };
}
