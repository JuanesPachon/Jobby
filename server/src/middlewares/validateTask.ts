import { check } from 'express-validator';

export const createTaskValidations = [
    check('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),

    check('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),

    check('city')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-.,()]+$/)
        .withMessage('City contains invalid characters'),

    check('neighborhood')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Neighborhood must not exceed 100 characters')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,()]*$/)
        .withMessage('Neighborhood contains invalid characters'),

    check('duration_hours')
        .notEmpty()
        .withMessage('Duration in hours is required')
        .isInt({ min: 1, max: 720 })
        .withMessage('Duration must be between 1 and 720 hours')
        .toInt(),

    check('salary')
        .notEmpty()
        .withMessage('Salary is required')
        .isFloat({ min: 0 })
        .withMessage('Salary must be a positive number'),
];
