import { check } from "express-validator";

export const userValidations = [
  check("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("First name must contain only letters"),

  check("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 40 })
    .withMessage("Last name must be between 2 and 40 characters")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("Last name must contain only letters"),

  check("birth_date")
    .notEmpty()
    .withMessage("Birth date is required")
    .isDate()
    .withMessage("Birth date must be a valid date")
    .custom((value: string) => {
      const birthDate = new Date(value);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        throw new Error("User must be at least 18 years old");
      }
      
      if (birthDate > today) {
        throw new Error("Birth date cannot be in the future");
      }
      
      return true;
    }),

  check("doc_type")
    .notEmpty()
    .withMessage("Document type is required")
    .isIn(['cedula de ciudadania', 'pasaporte', 'cedula de extranjeria'])
    .withMessage("Document type must be 'cedula de ciudadania', 'pasaporte', or 'cedula de extranjeria'"),

  check("doc_number")
    .notEmpty()
    .withMessage("Document number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Document number must be 10 characters")
    .isAlphanumeric()
    .withMessage("Document number must contain only letters and numbers"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email must not exceed 100 characters"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only numbers"),

  check("password")
    .if(({ req }) => {
      return req.body.oauth_provider === 'local' || !req.body.oauth_provider;
    })
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  check("oauth_provider")
    .optional()
    .isIn(['local', 'google'])
    .withMessage("OAuth provider must be 'local' or 'google'"),

  check("oauth_provider_id")
    .optional()
    .isLength({ max: 100 })
    .withMessage("OAuth provider ID must not exceed 100 characters"),

  check("avatar_url")
    .optional()
    .isURL()
    .withMessage("Avatar URL must be a valid URL")
    .isLength({ max: 255 })
    .withMessage("Avatar URL must not exceed 255 characters"),

  check("email_verified")
    .optional()
    .isBoolean()
    .withMessage("Email verified must be a boolean value"),

  check("accepted_terms")
    .notEmpty()
    .withMessage("Terms acceptance is required")
    .isBoolean()
    .withMessage("Accepted terms must be a boolean value")
    .custom((value: boolean) => {
      if (value !== true) {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),
];

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