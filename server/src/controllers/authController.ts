import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler.js';
import { loginUser, registerUser, verifyResetCode, resetPassword } from '../models/authModel.js';
import { ResetTokenPayload } from '../interfaces/resetPassword.interface.js';
import jwt from 'jsonwebtoken';
import pool from '../config/db_config.js';
import { GeneralResponse } from '../interfaces/response.interface.js';
import { saveResetPassword } from '../models/passwordResetModel.js';
import { ResetPassword } from '../interfaces/resetPassword.interface.js';
import { RowDataPacket } from 'mysql2/promise';
import MailService from '../utils/MailService.js';

const mailService = new MailService();

const registerController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const response = await registerUser(body);

        if (response.success) {
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
            });
        } else if (response.error === 'duplicate') {
            return errorHandler.handleDuplicateError(res, 'User already exists');
        } else {
            return errorHandler.handleServerError(res, 'Internal server error during registration');
        }
    } catch (error) {
        return errorHandler.handleServerError(res, 'Internal server error during registration');
    }
};

const loginController = async (req: Request, res: Response) => {
    try {
        const credentials = req.body;
        const response = await loginUser(credentials);

        if (response.success && response.user) {
            const tokenPayload = {
                sub: response.user.id,
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
                expiresIn: '14d',
            });

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.SERVER_PROD === 'true',
                sameSite: process.env.SERVER_PROD === 'true' ? ('none' as const) : ('lax' as const),
                maxAge: 14 * 24 * 60 * 60 * 1000,
                path: '/',
            };

            return res.cookie('access_token', token, cookieOptions).status(200).json({
                success: true,
                message: 'Login successful',
            });
        }

        switch (response.error) {
            case 'invalid_credentials':
                return errorHandler.handleInvalidCredentialsError(res);
            case 'server':
                return errorHandler.handleServerError(res, 'Internal server error during login');
            default:
                return errorHandler.handleServerError(res, 'Internal server error during login');
        }
    } catch (error) {
        return errorHandler.handleServerError(res, 'Login process failed');
    }
};

const validateTokenController = async (_req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Token is valid',
        });
    } catch (error) {
        return errorHandler.handleServerError(res, 'Internal server error during token validation');
    }
};

const logoutController = async (_req: Request, res: Response) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.SERVER_PROD === 'true',
            sameSite: process.env.SERVER_PROD === 'true' ? ('none' as const) : ('lax' as const),
            path: '/',
        };

        return res.clearCookie('access_token', cookieOptions).status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        return errorHandler.handleServerError(res, 'Internal server error during logout');
    }
};

const verifyCodeController = async (req: Request, res: Response) => {
    try {
        const verifyData = req.body;
        const response = await verifyResetCode(verifyData);

        if (response.success && response.userId && response.resetId) {
            const resetToken = jwt.sign(
                {
                    userId: response.userId,
                    resetId: response.resetId,
                    purpose: 'password_reset',
                },
                process.env.JWT_SECRET as string,
                { expiresIn: '15m' }
            );

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.SERVER_PROD === 'true',
                sameSite: process.env.SERVER_PROD === 'true' ? ('none' as const) : ('lax' as const),
                maxAge: 15 * 60 * 1000,
                path: '/',
            };

            return res.cookie('reset_token', resetToken, cookieOptions).status(200).json({
                success: true,
                message: 'Reset code verified successfully',
            });
        }

        switch (response.error) {
            case 'invalid_code':
                return errorHandler.handleValidationError(res, 'Invalid reset code');
            case 'code_expired':
                return errorHandler.handleValidationError(res, 'Reset code has expired');
            case 'code_used':
                return errorHandler.handleValidationError(res, 'Reset code has already been used');
            case 'user_not_found':
                return errorHandler.handleNotFoundError(res, 'User not found');
            case 'server':
                return errorHandler.handleServerError(
                    res,
                    'Internal server error during code verification'
                );
            default:
                return errorHandler.handleServerError(
                    res,
                    'Internal server error during code verification'
                );
        }
    } catch (error) {
        return errorHandler.handleServerError(
            res,
            'Internal server error during code verification'
        );
    }
};

const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const resetData = req.body;
        const resetToken = req.cookies.reset_token;

        if (!resetToken) {
            return res.status(401).json({
                success: false,
                error: 'Reset token required. Please verify your code first.',
            });
        }

        const decoded = jwt.verify(
            resetToken,
            process.env.JWT_SECRET as string
        ) as ResetTokenPayload;

        if (!decoded) {
            return errorHandler.handleValidationError(res, 'Invalid or expired reset token');
        }

        if (decoded.purpose !== 'password_reset') {
            return errorHandler.handleValidationError(res, 'Invalid token purpose');
        }

        const response = await resetPassword(resetData, decoded.userId);

        if (response.success) {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.SERVER_PROD === 'true',
                sameSite: process.env.SERVER_PROD === 'true' ? ('none' as const) : ('lax' as const),
                path: '/',
            };

            return res.clearCookie('reset_token', cookieOptions).status(200).json({
                success: true,
                message: 'Password updated successfully',
            });
        }

        switch (response.error) {
            case 'server':
                return errorHandler.handleServerError(
                    res,
                    'Internal server error during password reset'
                );
            default:
                return errorHandler.handleServerError(
                    res,
                    'Internal server error during password reset'
                );
        }
    } catch (error) {
        return errorHandler.handleServerError(res, 'Internal server error during password reset');
    }
};

const requestCodeController = async (_req: Request, res: Response) => {
    try {
        const [users] = await pool.query<RowDataPacket[]>(
            `SELECT email, id, first_name FROM users WHERE email = ?`,
            [_req.body.email]
        );
        if (users.length === 0) {
            const response: GeneralResponse = {
                success: false,
                message: 'Invalid email',
            };
            return res.status(400).json(response);
        } else {
            const userData = users[0];
            var expiresAt = new Date(new Date().getTime() + 15 * 60 * 1000);

            const newResetPassword: ResetPassword = {
                user_id: userData.id,
                reset_code: Math.floor(Math.random() * 900000) + 100000,
                expires_at: expiresAt,
                created_at: new Date(),
            };

            const resetPasswordSaved = await saveResetPassword(newResetPassword);
            if (!resetPasswordSaved) {
                throw new Error('Error trying to reset password');
            } else {
                const mailData = {
                    userName: userData.first_name,
                    code: newResetPassword.reset_code,
                    to: userData.email,
                    subject: 'Recuperación de contraseña',
                };

                const imageUrl = process.env.SUPABASE_URL || '';

                const mailTemplate = `
          <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <div style="text-align: center; padding:10px 0; background: #000000; border-radius: 10px 10px 0 0;">
                <img src="${imageUrl}/storage/v1/object/public/Jobby_files/jobby.png" alt="Jobby Logo" style="width: 100%; height: 80px; object-fit: contain;">
              </div>
              
              <div style="padding: 40px 30px;">
                <h2 style="color: #333333; font-size: 24px; margin-bottom: 20px;">¡Hola ${mailData.userName}!</h2>
                
                <p style="color: #000000; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Jobby. 
                  Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <p style="color: #000000; font-size: 18px; font-weight: bold; margin-bottom: 15px;">Tu código de verificación es:</p>
                  
                  <div style="display: inline-block; background: #000000; padding: 20px 30px; border-radius: 10px; margin: 20px 0; border: 2px solid #333333;">
                    <span style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                      ${mailData.code}
                    </span>
                  </div>
                  
                  <p style="color: #000000; font-size: 14px; margin-top: 15px;">
                    ⏰ Este código expira en 15 minutos
                  </p>
                </div>
                
                <div style="background-color: #f8f9ff; border-left: 4px solid #000000; padding: 20px; border-radius: 5px; margin: 30px 0;">
                  <h3 style="color: #333333; font-size: 16px; margin-bottom: 10px;">📋 Instrucciones:</h3>
                  <ol style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
                    <li>Regresa a la página de recuperación de contraseña</li>
                    <li>Ingresa el código de 6 dígitos mostrado arriba</li>
                    <li>Crea tu nueva contraseña segura</li>
                  </ol>
                </div>
                
              </div>
              
              <div style="background-color: #000000; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #333333;">
                <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">
                  © 2025 Jobby. Todos los derechos reservados.
                </p>
                <p style="color: #cccccc; font-size: 12px; margin: 0;">
                  Este es un correo automático, por favor no respondas a este mensaje.
                </p>
              </div>
              
            </div>
          </body>
        `;

                const info = await mailService.sendMail(
                    mailData.to,
                    mailData.subject,
                    '',
                    mailTemplate
                );

                if (!info) {
                    throw new Error('Error trying to send email');
                }
                return res.status(200).json({
                    success: true,
                    message: 'Email sent successfully',
                });
            }
        }
    } catch (error) {
        return errorHandler.handleServerError(res, 'Internal server error during code request');
    }
};

export {
    registerController,
    loginController,
    validateTokenController,
    logoutController,
    resetPasswordController,
    requestCodeController,
    verifyCodeController,
};
