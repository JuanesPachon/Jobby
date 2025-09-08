import { Router } from "express";
import { createTaskController, getTaskByIdController, getTasksController } from "../controllers/taskController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { createTaskValidations } from "../middlewares/validateTask.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/tasks", verifyToken, createTaskValidations, errorsIsEmpty, createTaskController);
router.get("/tasks", verifyToken, getTasksController);
router.get("/tasks/:id", verifyToken, getTaskByIdController);

export default router;
