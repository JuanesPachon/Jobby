import { Router } from 'express';
import {
    loginController,
    registerController,
    validateTokenController,
    logoutController,
    verifyCodeController,
    resetPasswordController,
    requestCodeController,
} from '../controllers/authController.js';
import errorsIsEmpty from '../middlewares/errorIsEmpty.js';
import { userValidations } from '../middlewares/validateUser.js';
import {
    verifyCodeValidations,
    resetPasswordValidations,
    loginValidations,
} from '../middlewares/validateAuth.js';
import verifyToken from '../middlewares/verifyToken.js';
import { authLimiter, passwordResetLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/auth/register', authLimiter, userValidations, errorsIsEmpty, registerController);
router.post('/auth/login', authLimiter, loginValidations, errorsIsEmpty, loginController);
router.get('/auth/validate', verifyToken, validateTokenController);
router.post('/auth/logout', logoutController);
router.post(
    '/auth/verify-code',
    passwordResetLimiter,
    verifyCodeValidations,
    errorsIsEmpty,
    verifyCodeController
);
router.post(
    '/auth/reset-password',
    passwordResetLimiter,
    resetPasswordValidations,
    errorsIsEmpty,
    resetPasswordController
);
router.post('/auth/recoveryotp', passwordResetLimiter, requestCodeController);

export default router;
