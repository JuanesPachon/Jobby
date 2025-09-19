import pool from "../config/db_config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CreateApplicationRequest, ApplicationWithApplicantInfo } from "../interfaces/application.interface.js";
import { CreateApplicationResult, GetApplicationsByTaskResult } from "../interfaces/database.interface.js";

const createApplication = async (applicant_id: number, applicationData: CreateApplicationRequest): Promise<CreateApplicationResult> => {
    try {
        const [taskRows] = await pool.query<RowDataPacket[]>(
            'SELECT id, creator_id, status FROM tasks WHERE id = ? AND deleted_at IS NULL',
            [applicationData.task_id]
        );

        if (taskRows.length === 0) {
            return {
                success: false,
                error: 'task_not_found',
                message: 'Task not found'
            };
        }

        const task = taskRows[0];

        if (task.status !== 'available') {
            return {
                success: false,
                error: 'task_not_available',
                message: 'Task is not available for applications'
            };
        }

        if (task.creator_id === applicant_id) {
            return {
                success: false,
                error: 'own_task',
                message: 'You cannot apply to your own task'
            };
        }

        const [existingRows] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM applications WHERE task_id = ? AND applicant_id = ?',
            [applicationData.task_id, applicant_id]
        );

        if (existingRows.length > 0) {
            return {
                success: false,
                error: 'already_applied',
                message: 'You have already applied to this task'
            };
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO applications (task_id, applicant_id) VALUES (?, ?)`,
            [applicationData.task_id, applicant_id]
        );

        if (result.affectedRows > 0) {
            const currentDate = new Date();
            const applicationCreated = {
                id: result.insertId,
                task_id: applicationData.task_id,
                applicant_id: applicant_id,
                applied_at: currentDate,
                status: 'applied' as const,
                status_changed_at: currentDate
            };

            return { 
                success: true,
                message: 'Application submitted successfully',
                data: applicationCreated
            };
        } else {
            return {
                success: false,
                error: 'server',
                message: 'Failed to create application'
            };
        }

    } catch (error: any) {
        console.error('Error in createApplication:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                error: 'already_applied',
                message: 'You have already applied to this task'
            };
        }

        return {
            success: false,
            error: 'server',
            message: 'Internal server error during application creation'
        };
    }
};

const getApplicationsByTask = async (task_id: number, creator_id: number): Promise<GetApplicationsByTaskResult> => {
    try {
        const [taskRows] = await pool.query<RowDataPacket[]>(
            'SELECT id, creator_id FROM tasks WHERE id = ? AND creator_id = ? AND deleted_at IS NULL',
            [task_id, creator_id]
        );

        if (taskRows.length === 0) {
            return {
                success: false,
                error: 'task_not_found',
                message: 'Task not found or you are not authorized to view its applications'
            };
        }

        const [applicationRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                a.id,
                a.task_id,
                a.applicant_id,
                a.applied_at,
                a.status,
                a.status_changed_at,
                u.first_name,
                u.last_name,
                u.avatar_url
            FROM applications a
            INNER JOIN users u ON a.applicant_id = u.id
            WHERE a.task_id = ?
            ORDER BY a.applied_at DESC`,
            [task_id]
        );

        const applications: ApplicationWithApplicantInfo[] = applicationRows.map(row => ({
            id: row.id,
            task_id: row.task_id,
            applicant_id: row.applicant_id,
            applied_at: row.applied_at,
            status: row.status,
            status_changed_at: row.status_changed_at,
            first_name: row.first_name,
            last_name: row.last_name,
            avatar_url: row.avatar_url
        }));

        return {
            success: true,
            message: 'Applications retrieved successfully',
            data: applications
        };

    } catch (error: any) {
        console.error('Error in getApplicationsByTask:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving applications'
        };
    }
};

export { createApplication, getApplicationsByTask };