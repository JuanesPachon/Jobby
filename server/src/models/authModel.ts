import bcrypt from "bcryptjs"
import pool from "../config/db_config.js";
import { ResultSetHeader } from "mysql2/promise";
import { DatabaseError } from "../interfaces/databaseError.js";

const registerUser = async (user: any) => {
    try {

        const hashedPassword = await bcrypt.hash(user.password, 10);
    
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
            };
        } else {
            throw new Error("there's a problem with the insertion");
        }

    } catch (error) {
        
        if (error instanceof Error && (error as DatabaseError).code === 'ER_DUP_ENTRY') {
            return { 
                success: false, 
                error: "duplicate",
            };
        } else {
            console.log(error);
            return { 
                success: false, 
                error: "server",
            };
        }
    }
}

export { registerUser };