import { Router } from 'express';
import {
    getUserDataController,
    getPublicUserProfileController,
    updateUserProfileController,
} from '../controllers/userController.js';
import { uploadCombined } from '../config/multer.config.js';
import {
    deleteOldImage,
    handleCombinedMulterError,
    uploadCombinedToSupabase,
} from '../middlewares/validateMulter.js';
import { updateProfileValidations } from '../middlewares/validateUpdateProfile.js';
import errorsIsEmpty from '../middlewares/errorIsEmpty.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = Router();

router.get('/user/profile', verifyToken, getUserDataController);
router.get('/user/profile/:id', verifyToken, getPublicUserProfileController);

router.patch(
    '/user/profile',
    verifyToken,
    uploadCombined.fields([
        { name: 'photoUrl', maxCount: 1 },
        { name: 'documents', maxCount: 3 },
    ]),
    handleCombinedMulterError,
    updateProfileValidations,
    errorsIsEmpty,
    deleteOldImage,
    uploadCombinedToSupabase,
    updateUserProfileController
);

export default router;
