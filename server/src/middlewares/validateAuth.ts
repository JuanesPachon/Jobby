import { check } from "express-validator";

export const loginValidations = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const verifyCodeValidations = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("Reset code must be between 6 and 10 characters")
    .isAlphanumeric()
    .withMessage("Reset code must contain only letters and numbers"),
];