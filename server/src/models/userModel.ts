import pool from "../config/db_config.js";
import { RowDataPacket } from "mysql2/promise";
import { User, UserSkill, UserDocument, UserExperience, UserProfile } from "../interfaces/user.interface.js";
import { getUserByIdResult, UpdateProfileResult } from "../interfaces/database.interface.js";
import { UpdateProfileRequest } from "../interfaces/updateProfile.interface.js";
import { supabaseClient } from "../config/multer.config.js";

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
                occupation,
                current_location,
                mock_email,
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
                company,
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
                id,
                skill_name
            FROM user_skills
            WHERE user_id = ? AND deleted_at IS NULL
            ORDER BY created_at DESC`,
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
                occupation: profileRows[0].occupation,
                current_location: profileRows[0].current_location,
                mock_email: profileRows[0].mock_email,
                created_at: profileRows[0].created_at,
                updated_at: profileRows[0].updated_at
            } as UserProfile;
        }

        user.experiences = experienceRows.map(row => ({
            id: row.id,
            title: row.title,
            company: row.company,
            start_date: row.start_date,
            end_date: row.end_date,
            created_at: row.created_at,
            updated_at: row.updated_at
        } as UserExperience));

        user.skills = skillRows.map(row => ({
            id: row.id,
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

const getUserByIdFiltered = async (userId: number): Promise<getUserByIdResult> => {
    try {
        const [userRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                id, 
                first_name, 
                last_name, 
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
                occupation,
                current_location,
                mock_email,
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
                company,
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
                id,
                skill_name
            FROM user_skills
            WHERE user_id = ? AND deleted_at IS NULL
            ORDER BY created_at DESC`,
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
                occupation: profileRows[0].occupation,
                current_location: profileRows[0].current_location,
                mock_email: profileRows[0].mock_email,
                created_at: profileRows[0].created_at,
                updated_at: profileRows[0].updated_at
            } as UserProfile;
        }

        user.experiences = experienceRows.map(row => ({
            id: row.id,
            title: row.title,
            company: row.company,
            start_date: row.start_date,
            end_date: row.end_date,
            created_at: row.created_at,
            updated_at: row.updated_at
        } as UserExperience));

        user.skills = skillRows.map(row => ({
            id: row.id,
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
        console.error('Error getting filtered user data:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving user data'
        };
    }
};

const updateUserProfile = async (userId: number, updateData: UpdateProfileRequest, photoUrl?: string): Promise<UpdateProfileResult> => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        let updatedUser = false;
        let updatedProfile = false;
        let experiencesProcessed = 0;
        let skillsProcessed = 0;
        let documentsProcessed = 0;

        const [userEmailRows] = await connection.query<RowDataPacket[]>(
            'SELECT email FROM users WHERE id = ?',
            [userId]
        );
        const userEmail = userEmailRows.length > 0 ? userEmailRows[0].email : null;

        const userFields: string[] = [];
        const userValues: any[] = [];

        if (updateData.first_name) {
            userFields.push('first_name = ?');
            userValues.push(updateData.first_name);
        }
        if (updateData.last_name) {
            userFields.push('last_name = ?');
            userValues.push(updateData.last_name);
        }
        if (updateData.email) {
            userFields.push('email = ?');
            userValues.push(updateData.email);
        }
        if (updateData.phone) {
            userFields.push('phone = ?');
            userValues.push(updateData.phone);
        }

        if (userFields.length > 0) {
            userValues.push(userId);
            await connection.query(
                `UPDATE users SET ${userFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                userValues
            );
            updatedUser = true;
        }

        if (updateData.description !== undefined || photoUrl || updateData.occupation !== undefined || updateData.current_location !== undefined || updateData.mock_email !== undefined) {
            const [existingProfile] = await connection.query<RowDataPacket[]>(
                'SELECT user_id FROM profiles WHERE user_id = ?',
                [userId]
            );

            if (existingProfile.length > 0) {
                const profileFields: string[] = [];
                const profileValues: any[] = [];

                if (updateData.description !== undefined) {
                    profileFields.push('description = ?');
                    profileValues.push(updateData.description);
                }
                if (photoUrl) {
                    profileFields.push('photo_url = ?');
                    profileValues.push(photoUrl);
                }
                if (updateData.occupation !== undefined) {
                    profileFields.push('occupation = ?');
                    profileValues.push(updateData.occupation);
                }
                if (updateData.current_location !== undefined) {
                    profileFields.push('current_location = ?');
                    profileValues.push(updateData.current_location);
                }
                if (updateData.mock_email !== undefined) {
                    profileFields.push('mock_email = ?');
                    profileValues.push(updateData.mock_email);
                }

                if (profileFields.length > 0) {
                    profileValues.push(userId);
                    await connection.query(
                        `UPDATE profiles SET ${profileFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
                        profileValues
                    );
                    updatedProfile = true;
                }
            } else {
                await connection.query(
                    'INSERT INTO profiles (user_id, description, photo_url, occupation, current_location, mock_email) VALUES (?, ?, ?, ?, ?, ?)',
                    [userId, updateData.description || null, photoUrl || null, updateData.occupation || null, updateData.current_location || null, updateData.mock_email || userEmail]
                );
                updatedProfile = true;
            }
        }

        //Experiences
        if (updateData.experiences && updateData.experiences.length > 0) {
            for (const exp of updateData.experiences) {
                switch (exp.action) {
                    case "add":
                        await connection.query(
                            "INSERT INTO experiences (user_id, title, company, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
                            [
                                userId,
                                exp.title,
                                exp.company,
                                exp.start_date,
                                exp.end_date,
                            ]
                        );
                        experiencesProcessed++;
                        break;

                    case "update":
                        if (exp.id) {
                            const updateFields: string[] = [];
                            const updateValues: any[] = [];

                            if (exp.title) {
                                updateFields.push("title = ?");
                                updateValues.push(exp.title);
                            }
                            if (exp.company !== undefined) {
                                updateFields.push("company = ?");
                                updateValues.push(exp.company);
                            }
                            if (exp.start_date !== undefined) {
                                updateFields.push("start_date = ?");
                                updateValues.push(exp.start_date);
                            }
                            if (exp.end_date !== undefined) {
                                updateFields.push("end_date = ?");
                                updateValues.push(exp.end_date);
                            }

                            if (updateFields.length > 0) {
                                updateValues.push(exp.id, userId);
                                await connection.query(
                                    `UPDATE experiences SET ${updateFields.join(
                                        ", "
                                    )}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
                                    updateValues
                                );
                                experiencesProcessed++;
                            }
                        }
                        break;

                    case "delete":
                        if (exp.id) {
                            await connection.query(
                                "DELETE FROM experiences WHERE id = ? AND user_id = ?",
                                [exp.id, userId]
                            );
                            experiencesProcessed++;
                        }
                        break;
                }
            }
        }

        //Skills
        if (updateData.skills && updateData.skills.length > 0) {
            for (const skill of updateData.skills) {
                switch (skill.action) {
                    case "add":
                        await connection.query(
                            "INSERT INTO user_skills (user_id, skill_name) VALUES (?, ?)",
                            [userId, skill.skill_name]
                        );
                        skillsProcessed++;
                        break;

                    case "delete":
                        if (skill.id) {
                            await connection.query(
                                "DELETE FROM user_skills WHERE id = ? AND user_id = ?",
                                [skill.id, userId]
                            );
                            skillsProcessed++;
                        }
                        break;
                }
            }
        }

        //Documents
        if (updateData.documents && updateData.documents.length > 0) {
            for (const doc of updateData.documents) {
                switch (doc.action) {
                    case "add":
                        if (doc.file_url) {
                            await connection.query(
                                "INSERT INTO user_documents (user_id, file_url) VALUES (?, ?)",
                                [userId, doc.file_url]
                            );
                            documentsProcessed++;
                        }
                        break;

                    case "delete":
                        if (doc.id) {
                            const [documentRows] = await connection.query<
                                RowDataPacket[]
                            >(
                                "SELECT file_url FROM user_documents WHERE id = ? AND user_id = ? AND deleted_at IS NULL",
                                [doc.id, userId]
                            );

                            if (documentRows.length > 0) {
                                const fileUrl = documentRows[0].file_url;

                                await connection.query(
                                    "DELETE FROM user_documents WHERE id = ? AND user_id = ?",
                                    [doc.id, userId]
                                );

                                if (fileUrl && fileUrl.trim() !== "") {
                                    try {
                                        let filePath = fileUrl;

                                        if (fileUrl.includes("supabase")) {
                                            const urlParts = fileUrl.split("/");
                                            filePath =
                                                urlParts[urlParts.length - 1];
                                        }

                                        const { error } =
                                            await supabaseClient.storage
                                                .from("Jobby_files")
                                                .remove([filePath]);

                                        if (error) {
                                            console.log(
                                                "No se pudo eliminar el documento de Supabase:",
                                                error
                                            );
                                        }
                                    } catch (supabaseError) {
                                        console.log(
                                            "Error al eliminar documento de Supabase:",
                                            supabaseError
                                        );
                                    }
                                }

                                documentsProcessed++;
                            }
                        }
                        break;
                }
            }
        }

        await connection.commit();
        const userData = await getUserByIdFiltered(userId);
        
        return {
            success: true,
            message: 'Profile updated successfully',
            data: {
                updated_user: updatedUser,
                updated_profile: updatedProfile,
                experiences_processed: experiencesProcessed,
                skills_processed: skillsProcessed,
                documents_processed: documentsProcessed,
                user: userData.success ? userData.user : undefined
            }
        };

    } catch (error) {
        await connection.rollback();
        console.error('Error updating user profile:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while updating profile'
        };
    } finally {
        connection.release();
    }
};

export { getUserById, updateUserProfile, getUserByIdFiltered };
