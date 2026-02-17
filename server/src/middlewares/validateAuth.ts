import { check } from 'express-validator';

export const loginValidations = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address'),

    check('password').notEmpty().withMessage('Password is required'),
];

export const verifyCodeValidations = [
    check('resetCode')
        .notEmpty()
        .withMessage('Reset code is required')
        .isLength({ min: 6, max: 10 })
        .withMessage('Reset code must be between 6 and 10 characters')
        .isAlphanumeric()
        .withMessage('Reset code must contain only letters and numbers'),
];

export const resetPasswordValidations = [
    check('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
];
