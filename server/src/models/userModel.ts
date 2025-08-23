import pool from "../config/db_config.js";
import { RowDataPacket } from "mysql2/promise";
import { User, UserSkill, UserDocument, UserExperience, UserProfile } from "../interfaces/user.interface.js";
import { getUserByIdResult } from "../interfaces/database.interface.js";

const getUserById = async (userId: number): Promise<getUserByIdResult> => {
    try {
        const [userRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                id, 
                first_name, 
                last_name, 
                birth_date, 
                doc_type, 
                doc_number, 
                email, 
                phone,
                created_at, 
                updated_at
            FROM users 
            WHERE id = ? AND deleted_at IS NULL`,
            [userId]
        );

        if (userRows.length === 0) {
            return {
                success: false,
                error: 'user_not_found',
                message: 'User not found'
            };
        }

        const user = userRows[0] as User;

        const [profileRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                photo_url,
                description,
                created_at,
                updated_at
            FROM profiles 
            WHERE user_id = ?`,
            [userId]
        );

        const [experienceRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                id,
                title,
                location,
                start_date,
                end_date,
                created_at,
                updated_at
            FROM experiences 
            WHERE user_id = ? AND deleted_at IS NULL
            ORDER BY start_date DESC`,
            [userId]
        );

        const [skillRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                us.skill_id,
                s.name as skill_name
            FROM user_skills us
            INNER JOIN skills s ON us.skill_id = s.id
            WHERE us.user_id = ?`,
            [userId]
        );

        const [documentRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                id,
                file_url,
                uploaded_at
            FROM user_documents 
            WHERE user_id = ? AND deleted_at IS NULL
            ORDER BY uploaded_at DESC`,
            [userId]
        );

        if (profileRows.length > 0) {
            user.profile = {
                photo_url: profileRows[0].photo_url,
                description: profileRows[0].description,
                created_at: profileRows[0].created_at,
                updated_at: profileRows[0].updated_at
            } as UserProfile;
        }

        user.experiences = experienceRows.map(row => ({
            id: row.id,
            title: row.title,
            location: row.location,
            start_date: row.start_date,
            end_date: row.end_date,
            created_at: row.created_at,
            updated_at: row.updated_at
        } as UserExperience));

        user.skills = skillRows.map(row => ({
            skill_id: row.skill_id,
            skill_name: row.skill_name
        } as UserSkill));

        user.documents = documentRows.map(row => ({
            id: row.id,
            file_url: row.file_url,
            uploaded_at: row.uploaded_at
        } as UserDocument));

        return {
            success: true,
            message: 'User data retrieved successfully',
            user: user
        };

    } catch (error) {
        console.error('Error getting user data:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving user data'
        };
    }
};

export { getUserById };
