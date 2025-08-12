import { Router } from "express";
import { loginController, registerController, validateTokenController, logoutController, verifyCodeController } from "../controllers/authController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { userValidations } from "../middlewares/validateUser.js";
import { verifyCodeValidations, loginValidations } from "../middlewares/validateAuth.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/auth/register", userValidations, errorsIsEmpty, registerController);
router.post("/auth/login", loginValidations, errorsIsEmpty, loginController);
router.get("/auth/validate", verifyToken, validateTokenController);
router.post("/auth/logout", logoutController);
router.post("/auth/verify-code", verifyCodeValidations, errorsIsEmpty, verifyCodeController);

export default router;

