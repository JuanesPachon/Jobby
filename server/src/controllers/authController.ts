import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { registerUser } from "../models/authModel.js";

const registerController = async (req: Request, res: Response) => {
  try {

    const body = req.body;
    const response = await registerUser(body);

    if (response.success) {
      res.json({
        success: true,
        message: "User registered successfully",
      });
    }

  } catch (error) {
      if (error instanceof Error && error.message === "duplicate") {
        errorHandler.handleDuplicateError(res);
      }
      errorHandler.handleServerError(res);
    }
};

export { registerController };
