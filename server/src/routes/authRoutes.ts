import { Router } from "express";
import { loginController, registerController, validateTokenController, logoutController, verifyCodeController, resetPasswordController, resetPasswordRequestController  } from "../controllers/authController.js";
import errorsIsEmpty from "../middlewares/errorIsEmpty.js";
import { userValidations } from "../middlewares/validateUser.js";
import { verifyCodeValidations, resetPasswordValidations, loginValidations } from "../middlewares/validateAuth.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/auth/register", userValidations, errorsIsEmpty, registerController);
router.post("/auth/login", loginValidations, errorsIsEmpty, loginController);
router.get("/auth/validate", verifyToken, validateTokenController);
router.post("/auth/logout", logoutController);
router.post("/auth/verify-code", verifyCodeValidations, errorsIsEmpty, verifyCodeController);
router.post("/auth/reset-password", resetPasswordValidations, errorsIsEmpty, resetPasswordController);

router.post("/user/recoveryotp", resetPasswordRequestController);
export default router;

