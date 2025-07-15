import bcrypt from "bcryptjs"
import pool from "../config/db_config.js";
import { ResultSetHeader } from "mysql2/promise";
import { DatabaseError } from "../interfaces/databaseError.js";

const registerUser = async (user: any) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO users (
            first_name, last_name, birth_date, doc_type, doc_number, email, phone,
            password_hash, oauth_provider, oauth_provider_id, avatar_url,
            email_verified, accepted_terms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user.first_name,
                user.last_name,
                user.birth_date,
                user.doc_type,
                user.doc_number,
                user.email,
                user.phone,
                hashedPassword ?? null,
                user.oauth_provider,
                user.oauth_provider_id ?? null,
                user.avatar_url ?? null,
                user.email_verified,
                user.accepted_terms
            ]
        );

        if (result.affectedRows > 0) {
            return { 
                success: true,
            };
        } else {
            return {
                success: false,
            };
        }

    } catch (error) {
        if (error instanceof Error && (error as DatabaseError).code === 'ER_DUP_ENTRY') {
            return { 
                success: false, 
                error: "duplicate",
            };
        } else {
            return { 
                success: false, 
                error: "server",
            };
        }
    }
}

export { registerUser };