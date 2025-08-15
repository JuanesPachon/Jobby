import bcrypt from "bcryptjs"
import pool from "../config/db_config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DatabaseError, RegisterResult, LoginResult, ResetPasswordResult, VerifyCodeResult } from "../interfaces/database.interface.js";
import { User } from "../interfaces/user.interface.js";
import { Auth } from "../interfaces/auth.interface.js";
import { ResetPasswordRequest, VerifyCodeRequest } from "../interfaces/resetPassword.interface.js";

const registerUser = async (user: User): Promise<RegisterResult> => {
    try {

        let hashedPassword: string | null = null;

        if (user.password) {
            hashedPassword = await bcrypt.hash(user.password, 10);
        }
    
        const queryValues = [
            user.first_name,
            user.last_name,
            user.birth_date,
            user.doc_type,
            user.doc_number,
            user.email,
            user.phone,
            hashedPassword,
            user.oauth_provider || 'local',
            user.oauth_provider_id || null,
            user.avatar_url || null,
            user.email_verified || false,
            user.accepted_terms
        ];
        
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO users (
            first_name, last_name, birth_date, doc_type, doc_number, email, phone,
            password_hash, oauth_provider, oauth_provider_id, avatar_url,
            email_verified, accepted_terms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            queryValues
        );

        if (result.affectedRows > 0) {
            return { 
                success: true,
                message: 'User registered successfully',
            };
        } else {
            return {
                success: false,
                error: 'server',
                message: 'Error inserting user into the database'
            };
        }

    } catch (error) {
        console.error('Error en registerUser:', error);
        
        if (error instanceof Error && (error as DatabaseError).code === 'ER_DUP_ENTRY') {
            return { 
                success: false, 
                error: 'duplicate',
                message: 'Email or docNumber are already registered'
            };
        } else {
            return { 
                success: false, 
                error: 'server',
                message: 'Internal server error'
            };
        }
    }
}

const loginUser = async (credentials: Auth): Promise<LoginResult> => {
    try {
       
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, password_hash, oauth_provider
             FROM users 
             WHERE email = ? AND deleted_at IS NULL`,
            [credentials.email]
        );

        if (rows.length === 0) {
            return {
                success: false,
                error: 'invalid_credentials',
                message: 'Invalid email or password'
            };
        }

        const user = rows[0];

        let isPasswordValid: boolean = false;

        if (user.oauth_provider === 'local') {
            isPasswordValid = await bcrypt.compare(credentials.password as string, user.password_hash);
        } else {
            isPasswordValid = true;
        }

        if (!isPasswordValid) {
            return {
                success: false,
                error: 'invalid_credentials',
                message: 'Invalid email or password'
            };
        }

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: credentials.email
            }
        };

    } catch (error) {
        return {
            success: false,
            error: 'server',
            message: 'Internal server error'
        };
    }
}

const verifyResetCode = async (verifyData: VerifyCodeRequest): Promise<VerifyCodeResult> => {
    try {
        const [resetRows] = await pool.query<RowDataPacket[]>(
            `SELECT id, user_id, expires_at, used_at 
             FROM password_resets 
             WHERE reset_code = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [verifyData.resetCode]
        );

        if (resetRows.length === 0) {
            return {
                success: false,
                error: 'invalid_code',
                message: 'Invalid reset code'
            };
        }

        const resetRecord = resetRows[0];

        if (resetRecord.used_at) {
            return {
                success: false,
                error: 'code_used',
                message: 'Reset code has already been used'
            };
        }

        const now = new Date();
        const expiresAt = new Date(resetRecord.expires_at);
        
        if (now > expiresAt) {
            return {
                success: false,
                error: 'code_expired',
                message: 'Reset code has expired'
            };
        }

        await pool.query<ResultSetHeader>(
            `UPDATE password_resets SET used_at = NOW() WHERE id = ?`,
            [resetRecord.id]
        );

        return {
            success: true,
            message: 'Reset code verified successfully',
            userId: resetRecord.user_id,
            resetId: resetRecord.id
        };

    } catch (error) {
        console.error('Error en verifyResetCode:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error'
        };
    }
}

const resetPassword = async (resetData: ResetPasswordRequest, userId: number): Promise<ResetPasswordResult> => {
    try {
        const hashedPassword = await bcrypt.hash(resetData.newPassword, 10);

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
            [hashedPassword, userId]
        );

        if (result.affectedRows > 0) {
            return {
                success: true,
                message: 'Password updated successfully'
            };
        } else {
            return {
                success: false,
                error: 'server',
                message: 'Error updating password'
            };
        }

    } catch (error) {
        return {
            success: false,
            error: 'server',
            message: 'Internal server error'
        };
    }
}

export { registerUser, loginUser, verifyResetCode, resetPassword };