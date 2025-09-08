import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { createTask, getTaskById, getTasks } from "../models/taskModel.js";
import { CreateTaskRequest, GetTasksFilters } from "../interfaces/task.interface.js";

const createTaskController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskData: CreateTaskRequest = req.body;
    const response = await createTask(creatorIdNumber, taskData);

    if (response.success) {
      return res.status(201).json(response);
    } else if (response.error === 'invalid_creator') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'constraint_violation') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in createTaskController:', error);
    return errorHandler.handleServerError(res, "Internal server error during task creation");
  }
};

const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const taskIdNumber = parseInt(taskId, 10);
    const response = await getTaskById(taskIdNumber);

    if (response.success && response.task) {
      return res.status(200).json({
        success: true,
        message: response.message,
        data: response.task
      });
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in getTaskByIdController:', error);
    return errorHandler.handleServerError(res, "Internal server error while retrieving task");
  }
};

const getTasksController = async (req: Request, res: Response) => {
  try {
    const filters: GetTasksFilters = {
      position: req.query.position as string,
      city: req.query.city as string,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined
    };

    if (filters.limit !== undefined && (isNaN(filters.limit) || filters.limit < 1)) {
      return errorHandler.handleValidationError(res, "Limit must be a positive number");
    }

    if (filters.page !== undefined && (isNaN(filters.page) || filters.page < 1)) {
      return errorHandler.handleValidationError(res, "Page must be a positive number starting from 1");
    }

    const response = await getTasks(filters);

    if (response.success && response.data) {
      return res.status(200).json(response);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in getTasksController:', error);
    return errorHandler.handleServerError(res, "Internal server error while retrieving tasks");
  }
};

export { createTaskController, getTaskByIdController, getTasksController };
