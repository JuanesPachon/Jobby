import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { loginUser, registerUser } from "../models/authModel.js";
import jwt from "jsonwebtoken";

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

    if (response.success && response.user) {

      const tokenPayload = {
        sub: response.user.id,
      }

      const token = jwt.sign(tokenPayload, (process.env.JWT_SECRET as string), {
        expiresIn: '14d'
      });

      return res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.SERVER_PROD === 'true',
        sameSite: 'lax', 
        maxAge: 14 * 24 * 60 * 60 * 1000
      }).status(200).json({
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

const validateTokenController = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    return errorHandler.handleServerError(res);
  }
};

export { registerController, loginController, validateTokenController };
