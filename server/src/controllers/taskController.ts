import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { createTask, getTaskById, getTasks, getUserTasks, getTaskWithApplications, selectApplicant, deselectApplicant, startTask, checkUserApplication, withdrawApplication, cancelTask, completeTask, getUserApplications, cleanupOldCancelledTasks } from '../models/taskModel.js';
import { createApplication } from "../models/applicationModel.js";
import { CreateTaskRequest, GetTasksFilters, SelectApplicantRequest, GetUserApplicationsFilters } from "../interfaces/task.interface.js";

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
    const userId = (req as any).user?.sub;

    const taskIdNumber = parseInt(taskId, 10);
    const response = await getTaskById(taskIdNumber, userId);

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
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      excludeOwnTasks: req.query.excludeOwnTasks === 'true',
      currentUserId: req.user?.sub ? parseInt(req.user.sub, 10) : undefined
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

const getMyTasksController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const filters = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      status: req.query.status as 'available' | 'in_progress' | 'completed' | 'cancelled' | undefined
    };


    if (filters.limit !== undefined && (isNaN(filters.limit) || filters.limit < 1)) {
      return errorHandler.handleValidationError(res, "Invalid limit parameter");
    }

    if (filters.page !== undefined && (isNaN(filters.page) || filters.page < 1)) {
      return errorHandler.handleValidationError(res, "Invalid page parameter");
    }

    if (filters.status && !['available', 'in_progress', 'completed', 'cancelled'].includes(filters.status)) {
      return errorHandler.handleValidationError(res, "Invalid status parameter");
    }

    const response = await getUserTasks(creatorIdNumber, filters);

    if (response.success && response.data) {
      return res.status(200).json(response);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in getUserTasksController:', error);
    return errorHandler.handleServerError(res, "Internal server error while retrieving user tasks");
  }
};

const getTaskApplicationsController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const response = await getTaskWithApplications(taskIdNumber, creatorIdNumber);

    if (response.success && response.data) {
      return res.status(200).json({
        success: true,
        message: response.message,
        data: response.data
      });
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'unauthorized') {
      return errorHandler.handleAuthError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in getTaskWithApplicationsController:', error);
    return errorHandler.handleServerError(res, "Internal server error while retrieving task with applications");
  }
};

const applyToTaskController = async (req: Request, res: Response) => {
  try {
    const applicant_id = req.user?.sub;
    
    if (!applicant_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const applicantIdNumber = parseInt(applicant_id, 10);
    
    if (isNaN(applicantIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const applicationData = { task_id: taskIdNumber };
    const response = await createApplication(applicantIdNumber, applicationData);

    if (response.success) {
      return res.status(201).json(response);
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'task_not_available') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'own_task') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'already_applied') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in applyToTaskController:', error);
    return errorHandler.handleServerError(res, "Internal server error during application creation");
  }
};

const selectApplicantController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const { applicant_id }: SelectApplicantRequest = req.body;
    const applicantIdNumber = parseInt(applicant_id.toString(), 10);

    if (isNaN(applicantIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid applicant ID");
    }

    const response = await selectApplicant(taskIdNumber, creatorIdNumber, applicantIdNumber);

    if (response.success) {
      return res.status(200).json(response);
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'unauthorized') {
      return errorHandler.handleAuthError(res, response.message);
    } else if (response.error === 'applicant_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'task_not_available') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'already_selected') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in selectApplicantController:', error);
    return errorHandler.handleServerError(res, "Internal server error during applicant selection");
  }
};

const deselectApplicantController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const response = await deselectApplicant(taskIdNumber, creatorIdNumber);

    if (response.success) {
      return res.status(200).json(response);
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'unauthorized') {
      return errorHandler.handleAuthError(res, response.message);
    } else if (response.error === 'applicant_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'task_not_available') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'already_selected') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in deselectApplicantController:', error);
    return errorHandler.handleServerError(res, "Internal server error during applicant deselection");
  }
};

const checkApplicationController = async (req: Request, res: Response) => {
  try {
    const applicant_id = req.user?.sub;
    
    if (!applicant_id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const applicantIdNumber = parseInt(applicant_id, 10);
    
    if (isNaN(applicantIdNumber)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario no válido'
      });
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea no válido'
      });
    }
    
    const result = await checkUserApplication(taskIdNumber, applicantIdNumber);

    return res.status(200).json({
      success: true,
      data: {
        hasApplied: result.hasApplied
      }
    });

  } catch (error) {
    console.error('Error in checkApplicationController:', error);
    return errorHandler.handleServerError(res, "Internal server error while checking application");
  }
};

const startTaskController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const response = await startTask(taskIdNumber, creatorIdNumber);

    if (response.success) {
      return res.status(200).json(response);
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'unauthorized') {
      return errorHandler.handleAuthError(res, response.message);
    } else if (response.error === 'task_not_available') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'already_selected') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in startTaskController:', error);
    return errorHandler.handleServerError(res, "Internal server error during task start");
  }
};

const withdrawApplicationController = async (req: Request, res: Response) => {
  try {
    const applicant_id = req.user?.sub;
    
    if (!applicant_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const applicantIdNumber = parseInt(applicant_id, 10);
    
    if (isNaN(applicantIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const response = await withdrawApplication(taskIdNumber, applicantIdNumber);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: response.message
      });
    } else if (response.error === 'application_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'cannot_withdraw') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, "Internal server error during application withdrawal");
    }

  } catch (error) {
    console.error('Error in withdrawApplicationController:', error);
    return errorHandler.handleServerError(res, "Internal server error during application withdrawal");
  }
};

const cancelTaskController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const response = await cancelTask(taskIdNumber, creatorIdNumber);

    if (response.success) {
      return res.status(200).json(response);
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'unauthorized') {
      return errorHandler.handleAuthError(res, response.message);
    } else if (response.error === 'task_not_cancellable') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'has_selected_applicant') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in cancelTaskController:', error);
    return errorHandler.handleServerError(res, "Internal server error during task cancellation");
  }
};

const completeTaskController = async (req: Request, res: Response) => {
  try {
    const creator_id = req.user?.sub;
    
    if (!creator_id) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const creatorIdNumber = parseInt(creator_id, 10);
    
    if (isNaN(creatorIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const taskId = req.params.id;
    const taskIdNumber = parseInt(taskId, 10);

    if (isNaN(taskIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid task ID");
    }

    const response = await completeTask(taskIdNumber, creatorIdNumber);

    if (response.success) {
      return res.status(200).json(response);
    } else if (response.error === 'task_not_found') {
      return errorHandler.handleNotFoundError(res, response.message);
    } else if (response.error === 'unauthorized') {
      return errorHandler.handleAuthError(res, response.message);
    } else if (response.error === 'task_not_in_progress') {
      return errorHandler.handleValidationError(res, response.message);
    } else if (response.error === 'no_selected_user') {
      return errorHandler.handleValidationError(res, response.message);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in completeTaskController:', error);
    return errorHandler.handleServerError(res, "Internal server error during task completion");
  }
};

const getMyApplicationsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    
    if (!userId) {
      return errorHandler.handleAuthError(res, "User not authenticated");
    }

    const userIdNumber = parseInt(userId, 10);
    
    if (isNaN(userIdNumber)) {
      return errorHandler.handleValidationError(res, "Invalid user ID");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const filters: GetUserApplicationsFilters = {
      page,
      limit,
      status: status ? status as 'applied' | 'selected' | 'in_progress' | 'completed' | 'cancelled' : undefined
    };

    const response = await getUserApplications(userIdNumber, filters);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in getMyApplicationsController:', error);
    return errorHandler.handleServerError(res, "Internal server error fetching user applications");
  }
};

const cleanupOldCancelledTasksController = async (_req: Request, res: Response) => {
  try {
    const response = await cleanupOldCancelledTasks();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return errorHandler.handleServerError(res, response.message);
    }

  } catch (error) {
    console.error('Error in cleanupOldCancelledTasksController:', error);
    return errorHandler.handleServerError(res, "Internal server error during cleanup");
  }
};

export { 
  createTaskController, 
  getTaskByIdController, 
  getTasksController, 
  getMyTasksController, 
  getTaskApplicationsController,
  applyToTaskController,
  selectApplicantController,
  deselectApplicantController,
  startTaskController,
  checkApplicationController,
  withdrawApplicationController,
  cancelTaskController,
  completeTaskController,
  getMyApplicationsController,
  cleanupOldCancelledTasksController
};
