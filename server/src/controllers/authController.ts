import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { loginUser, registerUser, verifyResetCode } from "../models/authModel.js";
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

const logoutController = async (_req: Request, res: Response) => {
  try {
    return res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.SERVER_PROD === 'true',
      sameSite: 'lax'
    }).status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    return errorHandler.handleServerError(res);
  }
};

const verifyCodeController = async (req: Request, res: Response) => {
  try {
    const verifyData = req.body;
    const response = await verifyResetCode(verifyData);

    if (response.success && response.userId && response.resetId) {
      const resetToken = jwt.sign(
        { 
          userId: response.userId,
          resetId: response.resetId,
          purpose: 'password_reset'
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      return res.cookie('reset_token', resetToken, {
        httpOnly: true,
        secure: process.env.SERVER_PROD === 'true',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      }).status(200).json({
        success: true,
        message: "Reset code verified successfully",
      });
    }

    switch (response.error) {
      case 'invalid_code':
        return res.status(400).json({
          success: false,
          error: "Invalid reset code"
        });
      case 'code_expired':
        return res.status(400).json({
          success: false,
          error: "Reset code has expired"
        });
      case 'code_used':
        return res.status(400).json({
          success: false,
          error: "Reset code has already been used"
        });
      case 'user_not_found':
        return errorHandler.handleNotFoundError(res, "User not found");
      case 'server':
        return errorHandler.handleServerError(res);
      default:
        return errorHandler.handleServerError(res);
    }

  } catch (error) {
    return errorHandler.handleServerError(res);
  }
};

export { registerController, loginController, validateTokenController, logoutController, verifyCodeController };
