import pool from "../config/db_config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CreateTaskRequest, GetTasksFilters } from "../interfaces/task.interface.js";
import { TaskWithApplications } from "../interfaces/application.interface.js";
import { CreateTaskResult, GetTaskByIdResult, GetTasksResult, GetUserTasksResult, GetTaskWithApplicationsResult } from "../interfaces/database.interface.js";

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
                up.photo_url as creator_photo_url
            FROM tasks t
            LEFT JOIN users u ON t.creator_id = u.id
            LEFT JOIN profiles up ON u.id = up.user_id
            WHERE t.id = ? AND t.deleted_at IS NULL AND t.status = 'available'`,
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
                t.id, t.creator_id, t.title, t.description, 
                t.city, t.neighborhood, t.duration_days, t.salary, t.status, 
                t.created_at, t.updated_at,
                u.first_name as creator_first_name,
                u.last_name as creator_last_name,
                up.photo_url as creator_photo_url
            FROM tasks t
            LEFT JOIN users u ON t.creator_id = u.id
            LEFT JOIN profiles up ON u.id = up.user_id
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

const getUserTasks = async (creator_id: number): Promise<GetUserTasksResult> => {
    try {
        const [taskRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                t.id,
                t.creator_id,
                t.selected_user_id,
                t.title,
                t.description,
                t.city,
                t.neighborhood,
                t.duration_days,
                t.salary,
                t.status,
                t.created_at,
                t.updated_at,
                COUNT(a.id) as applications_count
            FROM tasks t
            LEFT JOIN applications a ON t.id = a.task_id
            WHERE t.creator_id = ? AND t.deleted_at IS NULL
            GROUP BY t.id
            ORDER BY t.created_at DESC`,
            [creator_id]
        );

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
            applications_count: row.applications_count
        }));

        return {
            success: true,
            message: 'User tasks retrieved successfully',
            data: tasks
        };

    } catch (error: any) {
        console.error('Error getting user tasks:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving user tasks'
        };
    }
};

const getTaskWithApplications = async (task_id: number, creator_id: number): Promise<GetTaskWithApplicationsResult> => {
    try {
        const [taskRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                id, creator_id, selected_user_id, title, description, 
                city, neighborhood, duration_days, salary, status, 
                created_at, updated_at
            FROM tasks 
            WHERE id = ? AND creator_id = ? AND deleted_at IS NULL`,
            [task_id, creator_id]
        );

        if (taskRows.length === 0) {
            return {
                success: false,
                error: 'task_not_found',
                message: 'Task not found or you are not authorized to view it'
            };
        }

        const task = taskRows[0];

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

        const applications = applicationRows.map(row => ({
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

        const taskWithApplications: TaskWithApplications = {
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
            applications: applications
        };

        return {
            success: true,
            message: 'Task with applications retrieved successfully',
            data: taskWithApplications
        };

    } catch (error: any) {
        console.error('Error getting task with applications:', error);
        return {
            success: false,
            error: 'server',
            message: 'Internal server error while retrieving task with applications'
        };
    }
};

export { createTask, getTaskById, getTasks, getUserTasks, getTaskWithApplications };
