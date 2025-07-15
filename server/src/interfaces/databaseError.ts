export interface DatabaseError extends Error {
    code?: string;
    errno?: number;
    sqlState?: string;
}