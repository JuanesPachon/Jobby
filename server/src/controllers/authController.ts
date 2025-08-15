import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { loginUser, registerUser, verifyResetCode, resetPassword } from "../models/authModel.js";
import { ResetTokenPayload } from "../interfaces/resetPassword.interface.js";
import jwt from "jsonwebtoken";
import pool from "../config/db_config.js";
import { GeneralResponse } from "../interfaces/response.interface.js";
import { saveResetPassword } from "../models/passwordResetModel.js";
import { ResetPassword } from "../interfaces/resetPassword.interface.js";
import { RowDataPacket } from "mysql2/promise";
import MailService from "../utils/MailService.js";

const mailService = new MailService();

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

const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const resetData = req.body;
    const resetToken = req.cookies.reset_token;

    if (!resetToken) {
      return res.status(401).json({
        success: false,
        error: "Reset token required. Please verify your code first."
      });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string) as ResetTokenPayload;
    
    if (!decoded) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token"
      });
    }
    
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({
        success: false,
        error: "Invalid token purpose"
      });
    }

    const response = await resetPassword(resetData, decoded.userId);

    if (response.success) {
      return res.clearCookie('reset_token', {
        httpOnly: true,
        secure: process.env.SERVER_PROD === 'true',
        sameSite: 'lax'
      }).status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    switch (response.error) {
      case 'server':
        return errorHandler.handleServerError(res);
      default:
        return errorHandler.handleServerError(res);
    }

  } catch (error) {
    return errorHandler.handleServerError(res);
  }
};


const resetPasswordRequestController = async (_req: Request, res: Response) => {
  try {
    const [users]  = await pool.query<RowDataPacket[]>(`select email, id, first_name from users where email = '${_req.body.email}';`)
    if (!users) {
      const response : GeneralResponse = {message: "Email invalido"}
      return res.status(400).json(response) 
    }else {
      const userData = users[0];
      //15 min configured
      var expiresAt = new Date(new Date().getTime()+ 15*60*100);
      
      const newResetPassword: ResetPassword = {
        user_id: userData.id,
        reset_code: Math.floor(Math.random()*(10000000-0+1)),
        expires_at: expiresAt,
        created_at: new Date()
      }
      //Reset password is saved
      const resetPasswordSaved = await saveResetPassword(newResetPassword);
      if (!resetPasswordSaved) {
        throw new Error("Error trying to reset password")
      }else {
        const mailData = {
          userName: userData.first_name,
          code: newResetPassword.reset_code,
          to: userData.email,
          subject: "Recuperación de contraseña",
        }
          //todo send email
          const mailTemplate = `<div><h2>Hola ${mailData.userName},</h2></div>
          <div><p>tu codigo para recuperer contrase;a es: <b>${mailData.code}</b></p></div>`

          const info = await mailService.sendMail(mailData.to, mailData.subject, "", mailTemplate);
          console.info('mail result:', info);
          if (!info) {
            throw new Error("Error trying to send email")
          }
          return res.status(200).json({
            message: "Email sent successfully",
          });
      }
    }
    
  } catch (error) {
    return errorHandler.handleServerError(res);
  }
};

export { registerController, loginController, validateTokenController, logoutController, resetPasswordController as userController, resetPasswordRequestController, verifyCodeController };
