import { Router } from "express";
import { registerController } from "../controllers/authController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { userValidations } from "../middlewares/validateUser.js";

const router = Router();

router.post("/auth/register",userValidations, errorsIsEmpty, registerController);

export default router;

