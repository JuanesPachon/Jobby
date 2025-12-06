import { body } from "express-validator";

export const selectApplicantValidations = [
  body("applicant_id")
    .notEmpty()
    .withMessage("Applicant ID is required")
    .isInt({ min: 1 })
    .withMessage("Applicant ID must be a positive integer")
    .toInt()
];