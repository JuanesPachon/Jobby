export interface IUploadResult {
    success: boolean;
    error?: 'invalid_file' | 'upload_failed' | 'server';
    message?: string;
    data?: string;
}

export interface IMulterFile extends Express.Multer.File {
    supabaseUrl?: string;
}
