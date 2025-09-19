import { Router } from "express";
import { 
  createTaskController, 
  getTaskByIdController, 
  getTasksController, 
  getMyTasksController, 
  getTaskApplicationsController,
  applyToTaskController 
} from "../controllers/taskController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { createTaskValidations } from "../middlewares/validateTask.js";
import { createApplicationValidations } from "../middlewares/validateApplication.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/tasks", verifyToken, getTasksController);              
router.get("/tasks/:id", verifyToken, getTaskByIdController);       
router.post("/tasks", verifyToken, createTaskValidations, errorsIsEmpty, createTaskController);
router.post("/tasks/apply/:id", verifyToken, createApplicationValidations, errorsIsEmpty, applyToTaskController); 

router.get("/my-tasks", verifyToken, getMyTasksController);                    
router.get("/my-tasks/applications/:id", verifyToken, getTaskApplicationsController);

export default router;
