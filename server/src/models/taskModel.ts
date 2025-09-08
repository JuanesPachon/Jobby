import pool from "../config/db_config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CreateTaskRequest, GetTasksFilters } from "../interfaces/task.interface.js";
import { CreateTaskResult, GetTaskByIdResult, GetTasksResult } from "../interfaces/database.interface.js";

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
            message: 'Internal server error while creating task'
        };
    }
};

const getTaskById = async (taskId: number): Promise<GetTaskByIdResult> => {
    try {
        const [taskRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                t.*, 
                u.first_name as creator_first_name,
                u.last_name as creator_last_name,
                up.photo_url as creator_photo_url,
                su.first_name as selected_user_first_name,
                su.last_name as selected_user_last_name,
                sup.photo_url as selected_user_photo_url
            FROM tasks t
            LEFT JOIN users u ON t.creator_id = u.id
            LEFT JOIN profiles up ON u.id = up.user_id
            LEFT JOIN users su ON t.selected_user_id = su.id
            LEFT JOIN profiles sup ON su.id = sup.user_id
            WHERE t.id = ? AND t.deleted_at IS NULL`,
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
                deleted_at: task.deleted_at,
                creator: {
                    id: task.creator_id,
                    first_name: task.creator_first_name,
                    last_name: task.creator_last_name,
                    photo_url: task.creator_photo_url
                },
                selected_user: task.selected_user_id ? {
                    id: task.selected_user_id,
                    first_name: task.selected_user_first_name,
                    last_name: task.selected_user_last_name,
                    photo_url: task.selected_user_photo_url
                } : null
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

const getTasks = async (filters: GetTasksFilters): Promise<GetTasksResult> => {
    try {
        let query = `
            SELECT 
                t.id, t.creator_id, t.selected_user_id, t.title, t.description, 
                t.city, t.neighborhood, t.duration_days, t.salary, t.status, 
                t.created_at, t.updated_at,
                u.first_name as creator_first_name,
                u.last_name as creator_last_name,
                up.photo_url as creator_photo_url,
                su.first_name as selected_user_first_name,
                su.last_name as selected_user_last_name,
                sup.photo_url as selected_user_photo_url
            FROM tasks t
            LEFT JOIN users u ON t.creator_id = u.id
            LEFT JOIN profiles up ON u.id = up.user_id
            LEFT JOIN users su ON t.selected_user_id = su.id
            LEFT JOIN profiles sup ON su.id = sup.user_id
            WHERE t.deleted_at IS NULL AND t.status = 'available'
        `;
        
        const queryParams: any[] = [];
        
        if (filters.position && filters.position.trim() !== '') {
            query += ' AND title LIKE ?';
            queryParams.push(`%${filters.position.trim()}%`);
        }
        
        if (filters.city && filters.city.trim() !== '') {
            query += ' AND city = ?';
            queryParams.push(filters.city.trim());
        }
        
        query += ' ORDER BY created_at DESC';
        
        const limit = filters.limit || 20;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;
        
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);
        
        const [taskRows] = await pool.query<RowDataPacket[]>(query, queryParams);
        
        let countQuery = `
            SELECT COUNT(*) as total
            FROM tasks 
            WHERE deleted_at IS NULL AND status = 'available'
        `;
        
        const countParams: any[] = [];
        
        if (filters.position && filters.position.trim() !== '') {
            countQuery += ' AND title LIKE ?';
            countParams.push(`%${filters.position.trim()}%`);
        }
        
        if (filters.city && filters.city.trim() !== '') {
            countQuery += ' AND city = ?';
            countParams.push(filters.city.trim());
        }
        
        const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
        const total = countRows[0].total;
        
        const tasks = taskRows.map(row => ({
            id: row.id,
            creator_id: row.creator_id,
            selected_user_id: row.selected_user_id,
            title: row.title,
            description: row.description,
            city: row.city,
            neighborhood: row.neighborhood,
            duration_days: row.duration_days,
            salary: row.salary,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            creator: {
                id: row.creator_id,
                first_name: row.creator_first_name,
                last_name: row.creator_last_name,
                photo_url: row.creator_photo_url
            },
            selected_user: row.selected_user_id ? {
                id: row.selected_user_id,
                first_name: row.selected_user_first_name,
                last_name: row.selected_user_last_name,
                photo_url: row.selected_user_photo_url
            } : null
        }));
        
        return {
            success: true,
            message: 'Tasks retrieved successfully',
            data: {
                tasks,
                total
            }
        };
        
    } catch (error: any) {
        console.error('Error getting tasks:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving tasks'
        };
    }
};

export { createTask, getTaskById, getTasks };
