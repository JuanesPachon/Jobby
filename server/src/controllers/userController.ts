import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler.js";
import { getUserById, updateUserProfile } from "../models/userModel.js";
import { UpdateProfileRequest } from "../interfaces/updateProfile.interface.js";

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

const updateUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return errorHandler.handleAuthError(res, "User ID not found in token");
    }

    const numericUserId = parseInt(userId, 10);
    const updateData: UpdateProfileRequest = req.body;
    
    const photoUrl = req.body.photoUrl;

    const uploadedDocuments = req.body.uploadedDocuments;
    if (uploadedDocuments && Array.isArray(uploadedDocuments) && uploadedDocuments.length > 0) {
      const documentOperations = uploadedDocuments.map((fileUrl: string) => ({
        action: 'add' as const,
        file_url: fileUrl
      }));

      if (updateData.documents && Array.isArray(updateData.documents)) {
        updateData.documents = [...updateData.documents, ...documentOperations];
      } else {
        updateData.documents = documentOperations;
      }
    }

    const response = await updateUserProfile(numericUserId, updateData, photoUrl);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: response.message,
        data: response.data
      });
    }

    switch (response.error) {
      case 'user_not_found':
        return errorHandler.handleNotFoundError(res, response.message || "User not found");
      case 'validation_error':
        return errorHandler.handleValidationError(res, response.message || "Invalid data provided");
      case 'server':
        return errorHandler.handleServerError(res, response.message || "Failed to update profile");
      default:
        return errorHandler.handleServerError(res, "Failed to update profile");
    }

  } catch (error) {
    console.error('Error in updateUserProfileController:', error);
    return errorHandler.handleServerError(res, "Profile update process failed");
  }
};

export { getUserDataController, updateUserProfileController };
