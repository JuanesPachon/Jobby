import { Router } from "express";
import { loginController, registerController, validateTokenController } from "../controllers/authController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { loginValidations, userValidations } from "../middlewares/validateUser.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/auth/register",userValidations, errorsIsEmpty, registerController);
router.post("/auth/login", loginValidations,errorsIsEmpty, loginController);
router.get("/auth/validate", verifyToken, validateTokenController);

export default router;

