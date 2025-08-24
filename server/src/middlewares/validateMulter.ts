import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'base64-arraybuffer';
import path from 'path';
import pool from '../config/db_config.js';
import { RowDataPacket } from 'mysql2/promise';
import 'dotenv/config';
import { IUploadResult } from '../interfaces/multer.interface.js';
import { supabaseClient } from '../config/multer.config.js';

const createUploadResult = (
    success: boolean,
    error?: 'invalid_file' | 'upload_failed' | 'server',
    message?: string,
    data?: string
): IUploadResult => {
    return { success, error, message, data };
};

const deleteOldImage = async (req: Request, _res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const hasNewPhoto = Array.isArray(req.files) 
            ? req.files.some(file => file.fieldname === 'photoUrl')
            : req.files?.['photoUrl']?.[0];

        if (!hasNewPhoto || !req.user?.sub) {
            return next();
        }

        const userId = parseInt(req.user.sub, 10);

        const [profileRows] = await pool.query<RowDataPacket[]>(
            'SELECT photo_url FROM profiles WHERE user_id = ? AND photo_url IS NOT NULL',
            [userId]
        );

        if (profileRows.length > 0) {
            const oldPhotoUrl = profileRows[0].photo_url;
            
            if (oldPhotoUrl && oldPhotoUrl.trim() !== '') {
                let filePath = oldPhotoUrl;
                
                if (oldPhotoUrl.includes('supabase')) {
                    const urlParts = oldPhotoUrl.split('/');
                    filePath = urlParts[urlParts.length - 1];
                }

                const { error } = await supabaseClient.storage
                    .from('Jobby_files')
                    .remove([filePath]);

                if (error) {
                    console.log('No se pudo eliminar la imagen anterior de Supabase:', error);
                }
            }
        }

        next();
    } catch (error) {
        console.log('Error al consultar/eliminar imagen anterior:', error);
        next();
    }
};

const handleCombinedMulterError = (error: any, _req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof multer.MulterError) {
        let message = 'Error uploading files';
        
        switch (error.code) {
            case 'LIMIT_FILE_COUNT':
                message = 'Maximum 4 files allowed (1 image + 3 PDFs)';
                break;
            case 'LIMIT_FILE_SIZE':
                message = 'File size too large. Maximum 10MB per file';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Invalid field. Use "photoUrl" for image or "documents" for PDFs';
                break;
            default:
                message = error.message || 'Error uploading files';
        }
        
        const result = createUploadResult(false, 'invalid_file', message);
        res.status(400).json(result);
        return;
    }
    
    if (error.message?.includes('Profile photo must be') || 
        error.message?.includes('Documents must be') || 
        error.message === 'Unexpected field') {
        const result = createUploadResult(false, 'invalid_file', error.message);
        res.status(400).json(result);
        return;
    }
    
    next(error);
};

const uploadCombinedToSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const photoFile = Array.isArray(req.files) 
            ? req.files.find(file => file.fieldname === 'photoUrl')
            : req.files?.['photoUrl']?.[0];

        if (photoFile) {
            const { originalname, buffer } = photoFile;
            const filePath = `${Date.now()}-${originalname}`;
            const fileBase64 = decode(buffer.toString('base64'));

            const { error } = await supabaseClient.storage.from('Jobby_files').upload(filePath, fileBase64, {
                contentType: 'image/' + path.extname(originalname).substring(1),
            });

            if (error) {
                console.error('Error uploading profile image:', error);
                const result = createUploadResult(false, 'upload_failed', 'Error uploading profile image');
                return res.status(500).json(result);
            }

            req.body.photoUrl = filePath;
        }

        const documentFiles = Array.isArray(req.files) 
            ? req.files.filter(file => file.fieldname === 'documents')
            : req.files?.['documents'] || [];

        if (documentFiles.length > 0) {
            const uploadPromises: Promise<string>[] = [];

            for (const file of documentFiles) {
                const { originalname, buffer } = file;
                const filePath = `documents/${Date.now()}-${Math.random().toString(36).substring(2)}-${originalname}`;
                const fileBase64 = decode(buffer.toString('base64'));

                const uploadPromise = supabaseClient.storage
                    .from('Jobby_files')
                    .upload(filePath, fileBase64, {
                        contentType: 'application/pdf',
                    })
                    .then(({ error }) => {
                        if (error) {
                            console.error(`Error uploading ${originalname}:`, error);
                            throw new Error(`Failed to upload ${originalname}`);
                        }
                        return filePath;
                    });

                uploadPromises.push(uploadPromise);
            }

            const uploadedDocuments = await Promise.all(uploadPromises);
            req.body.uploadedDocuments = uploadedDocuments;
        }

        next();

    } catch (uploadError) {
        console.error('Error in combined upload process:', uploadError);
        const result = createUploadResult(false, 'server', 'Error processing files');
        return res.status(500).json(result);
    }
};

export { deleteOldImage, handleCombinedMulterError, uploadCombinedToSupabase };