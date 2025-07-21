import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { loginUser, registerUser } from "../models/authModel.js";

const registerController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const response = await registerUser(body);

    if (response.success) {
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else if (response.error === "duplicate") {
      return errorHandler.handleDuplicateError(res);
    } else {
      return errorHandler.handleServerError(res);
    }

  } catch (error) {
    return errorHandler.handleServerError(res);
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    
    const credentials = req.body;
    const response = await loginUser(credentials);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
      });
    } 

    switch (response.error) {
      case 'invalid_credentials':
        return errorHandler.handleInvalidCredentialsError(res);
      case 'server':
        return errorHandler.handleServerError(res);
      default:
        return errorHandler.handleServerError(res);
    }

  } catch (error) {
    return errorHandler.handleServerError(res);
  }
}

export { registerController, loginController };
