import pool from "../config/db_config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CreateTaskRequest } from "../interfaces/task.interface.js";
import { CreateTaskResult, GetTaskByIdResult } from "../interfaces/database.interface.js";

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

const getTaskById = async (taskId: number): Promise<GetTaskByIdResult> => {
    try {
        const [taskRows] = await pool.query<RowDataPacket[]>(
            `SELECT *
            FROM tasks 
            WHERE id = ? AND deleted_at IS NULL`,
            [taskId]
        );

        if (taskRows.length === 0) {
            return {
                success: false,
                error: 'task_not_found',
                message: 'Task not found'
            };
        }

        const task = taskRows[0];

        return {
            success: true,
            message: 'Task retrieved successfully',
            task: {
                id: task.id,
                creator_id: task.creator_id,
                selected_user_id: task.selected_user_id,
                title: task.title,
                description: task.description,
                city: task.city,
                neighborhood: task.neighborhood,
                duration_days: task.duration_days,
                salary: task.salary,
                status: task.status,
                created_at: task.created_at,
                updated_at: task.updated_at,
                deleted_at: task.deleted_at
            }
        };

    } catch (error: any) {
        console.error('Error getting task: ', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving task'
        };
    }
};

export { createTask, getTaskById };
