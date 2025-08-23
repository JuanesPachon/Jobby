import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { getUserById } from "../models/userModel.js";

const getUserDataController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token"
      });
    }

    const numericUserId = parseInt(userId, 10);

    const response = await getUserById(numericUserId);

    if (response.success && response.user) {
      return res.status(200).json({
        success: true,
        message: response.message,
        data: response.user
      });
    }

    switch (response.error) {
      case 'user_not_found':
        return errorHandler.handleNotFoundError(res, response.message);
      case 'server':
        return errorHandler.handleServerError(res, response.message);
      default:
        return errorHandler.handleServerError(res, "Internal server error while retrieving user data");
    }

  } catch (error) {
    console.error('Error in getUserDataController:', error);
    return errorHandler.handleServerError(res, "Internal server error");
  }
};

export { getUserDataController };
