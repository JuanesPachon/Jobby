import { ResultSetHeader } from "mysql2/promise";
import { ResetPassword } from "../interfaces/resetPassword.interface.js";
import pool from "../config/db_config.js";

const saveResetPassword = async (newResetPassword: ResetPassword): Promise<boolean> => {
    try {
    
        const queryValues = [
            newResetPassword.user_id,
            newResetPassword.reset_code,
            newResetPassword.expires_at,
            newResetPassword.created_at,
            newResetPassword.used_at
        ];
        
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO password_resets (
            user_id, reset_code, birth_date, expires_at, created_at
            ) VALUES (?, ?, ?, ?, ?)`,
            queryValues
        );

        return result.affectedRows > 0; 
    } catch (error) {
        console.error('Error en resetPassword:', error);
        throw error
    }
}

export {saveResetPassword}