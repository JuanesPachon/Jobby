import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { createTask } from "../models/taskModel.js";
import { CreateTaskRequest } from "../interfaces/task.interface.js";

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
      return errorHandler.handleValidationError(res, response.message || "Invalid creator user");
    } else if (response.error === 'constraint_violation') {
      return errorHandler.handleValidationError(res, response.message || "Data validation error");
    } else if (response.error === 'server') {
      return errorHandler.handleServerError(res, response.message || "Internal server error during task creation");
    } else {
      return errorHandler.handleServerError(res, "Unexpected error during task creation");
    }

  } catch (error) {
    console.error('Error in createTaskController:', error);
    return errorHandler.handleServerError(res, "Internal server error during task creation");
  }
};

export { createTaskController };
