import { Router } from "express";
import { getUserDataController } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/user/profile", verifyToken, getUserDataController);

export default router;
