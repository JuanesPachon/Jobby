import { Router } from "express";
import { loginController, registerController } from "../controllers/authController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { loginValidations, userValidations } from "../middlewares/validateUser.js";

const router = Router();

router.post("/auth/register",userValidations, errorsIsEmpty, registerController);
router.post("/auth/login", loginValidations,errorsIsEmpty, loginController);

export default router;

