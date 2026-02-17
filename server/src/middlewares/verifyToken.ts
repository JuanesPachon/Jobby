import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import errorHandler from '../utils/errorHandler.js';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            sub: string;
            iat: number;
        };

        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        return errorHandler.handleServerError(res);
    }
};

export default verifyToken;
