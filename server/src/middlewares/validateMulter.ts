import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'base64-arraybuffer';
import path from 'path';
import 'dotenv/config';
import { IUploadResult, IMulterFile } from '../interfaces/multer.interface.js';
import { supabaseClient } from '../config/multer.config.js';

const createUploadResult = (
    success: boolean,
    error?: 'invalid_file' | 'upload_failed' | 'server',
    message?: string,
    data?: string
): IUploadResult => {
    return { success, error, message, data };
};

const handleMulterError = (error: any, _req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof multer.MulterError || error.message === 'File is not in a valid format') {
        const result = createUploadResult(false, 'invalid_file', error.message || 'Invalid file');
        res.status(400).json(result);
        return;
    }
    next(error);
};

const uploadToSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (!req.file) {
        return next();
    }

    try {
        const { originalname, buffer } = req.file;
        const filePath = `${Date.now()}-${originalname}`;
        const fileBase64 = decode(buffer.toString('base64'));

        const { error } = await supabaseClient.storage.from('Jobby_files').upload(filePath, fileBase64, {
            contentType: 'image/' + path.extname(originalname).substring(1),
        });

        if (error) {
            console.error('Error al subir la imagen a Supabase:', error);
            const result = createUploadResult(false, 'upload_failed', 'Error uploading image to Supabase');
            return res.status(500).json(result);
        }

        (req.file as IMulterFile).supabaseUrl = filePath;
        req.body.photoUrl = filePath;

        next();
    } catch (uploadError) {
        console.error('Error inesperado al subir la imagen:', uploadError);
        const result = createUploadResult(false, 'server', 'Error processing image');
        return res.status(500).json(result);
    }
};

const deleteOldImage = async (req: Request, _res: Response, next: NextFunction): Promise<void | Response> => {
    
};

export { handleMulterError, uploadToSupabase, deleteOldImage };