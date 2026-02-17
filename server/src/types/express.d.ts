import { IMulterFile } from '../interfaces/multer.interface.ts';

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                iat: number;
            };
            file?: IMulterFile;
        }
    }
}

export {};
