import pool from "../config/db_config.js";
import { ResultSetHeader } from "mysql2/promise";
import { CreateTaskRequest } from "../interfaces/task.interface.js";
import { CreateTaskResult } from "../interfaces/database.interface.js";

const createTask = async (creator_id: number, taskData: CreateTaskRequest): Promise<CreateTaskResult> => {
    try {
        const queryValues = [
            creator_id,
            taskData.title,
            taskData.description,
            taskData.city,
            taskData.neighborhood || null,
            taskData.duration_days,
            taskData.salary
        ];
        
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO tasks (
                creator_id, title, description, city, neighborhood, 
                duration_days, salary
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            queryValues
        );

        if (result.affectedRows > 0) {
            const currentDate = new Date();
            const taskData_created = {
                id: result.insertId,
                creator_id: creator_id,
                selected_user_id: null,
                title: taskData.title,
                description: taskData.description,
                city: taskData.city,
                neighborhood: taskData.neighborhood || null,
                duration_days: taskData.duration_days,
                salary: taskData.salary,
                status: 'available' as const,
                created_at: currentDate,
                updated_at: currentDate
            };

            return { 
                success: true,
                message: 'Task created successfully',
                data: taskData_created
            };
        } else {
            return {
                success: false,
                error: 'server',
                message: 'Failed to create task'
            };
        }

    } catch (error: any) {
        console.error('Error creating task:', error);
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return {
                success: false,
                error: 'invalid_creator',
                message: 'Invalid creator user ID'
            };
        }

        if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return {
                success: false,
                error: 'constraint_violation',
                message: 'Invalid data: duration_days must be greater than 0 and salary must be >= 0'
            };
        }

        return {
            success: false,
            error: 'server',
            message: 'Internal server error while updating profile'
        };
    }
};

export { createTask };
