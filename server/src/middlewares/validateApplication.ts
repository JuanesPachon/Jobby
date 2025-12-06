import { param } from "express-validator";

export const createApplicationValidations = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isInt({ min: 1 })
    .withMessage("Task ID must be a positive integer")
    .toInt()
];