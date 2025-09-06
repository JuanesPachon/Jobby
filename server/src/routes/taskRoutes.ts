import { Router } from "express";
import { createTaskController } from "../controllers/taskController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { createTaskValidations } from "../middlewares/validateTask.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/tasks", verifyToken, createTaskValidations, errorsIsEmpty, createTaskController);

export default router;
