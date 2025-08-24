import { check, body } from "express-validator";

export const updateProfileValidations = [
  check("first_name")
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("First name must contain only letters"),

  check("last_name")
    .optional()
    .isLength({ min: 2, max: 40 })
    .withMessage("Last name must be between 2 and 40 characters")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("Last name must contain only letters"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email must not exceed 100 characters"),

  check("phone")
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only numbers"),

  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("experiences")
    .optional()
    .isArray()
    .withMessage("Experiences must be an array")
    .custom((experiences: any[]) => {
      if (experiences && experiences.length > 10) {
        throw new Error("Maximum 10 experiences allowed per request");
      }
      return true;
    }),

  body("experiences.*.action")
    .if(body("experiences").exists())
    .notEmpty()
    .withMessage("Experience action is required")
    .isIn(['add', 'update', 'delete'])
    .withMessage("Experience action must be 'add', 'update', or 'delete'"),

  body("experiences.*.id")
    .if(body("experiences.*.action").isIn(['update', 'delete']))
    .notEmpty()
    .withMessage("Experience ID is required for update and delete actions")
    .isInt({ min: 1 })
    .withMessage("Experience ID must be a positive integer"),

  body("experiences.*.title")
    .if(body("experiences.*.action").isIn(['add', 'update']))
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Experience title must be between 2 and 100 characters"),

  body("experiences.*.location")
    .if(body("experiences.*.action").isIn(['add', 'update']))
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Experience location must be between 2 and 100 characters"),

  body("experiences.*.start_date")
    .if(body("experiences.*.action").isIn(['add', 'update']))
    .optional()
    .isDate()
    .withMessage("Start date must be a valid date")
    .custom((value: string) => {
      const startDate = new Date(value);
      const today = new Date();
      
      if (startDate > today) {
        throw new Error("Start date cannot be in the future");
      }
      
      return true;
    }),

  body("experiences.*.end_date")
    .if(body("experiences.*.action").isIn(['add', 'update']))
    .optional()
    .isDate()
    .withMessage("End date must be a valid date")
    .custom((value: string, { req }) => {
      if (value) {
        const endDate = new Date(value);
        const today = new Date();
        
        if (endDate > today) {
          throw new Error("End date cannot be in the future");
        }

        const experiences = req.body.experiences || [];
        const currentExperience = experiences.find((exp: any) => exp.end_date === value);
        if (currentExperience && currentExperience.start_date) {
          const startDate = new Date(currentExperience.start_date);
          if (endDate <= startDate) {
            throw new Error("End date must be after start date");
          }
        }
      }
      
      return true;
    }),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array")
    .custom((skills: any[]) => {
      if (skills && skills.length > 20) {
        throw new Error("Maximum 20 skills allowed per request");
      }
      return true;
    }),

  body("skills.*.action")
    .if(body("skills").exists())
    .notEmpty()
    .withMessage("Skill action is required")
    .isIn(['add', 'delete'])
    .withMessage("Skill action must be 'add' or 'delete'"),

  body("skills.*.skill_name")
    .if(body("skills.*.action").equals('add'))
    .notEmpty()
    .withMessage("Skill name is required for add action")
    .isLength({ min: 2, max: 50 })
    .withMessage("Skill name must be between 2 and 50 characters")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.#+-]+$/)
    .withMessage("Skill name contains invalid characters"),

  body("skills.*.id")
    .if(body("skills.*.action").equals('delete'))
    .notEmpty()
    .withMessage("Skill ID is required for delete action")
    .isInt({ min: 1 })
    .withMessage("Skill ID must be a positive integer"),

  body("documents")
    .optional()
    .isArray()
    .withMessage("Documents must be an array")
    .custom((documents: any[]) => {
      if (documents && documents.length > 5) {
        throw new Error("Maximum 5 document operations allowed per request");
      }
      return true;
    }),

  body("documents.*.action")
    .if(body("documents").exists())
    .notEmpty()
    .withMessage("Document action is required")
    .isIn(['add', 'delete'])
    .withMessage("Document action must be 'add' or 'delete'"),

  body("documents.*.id")
    .if(body("documents.*.action").equals('delete'))
    .notEmpty()
    .withMessage("Document ID is required for delete action")
    .isInt({ min: 1 })
    .withMessage("Document ID must be a positive integer"),


  body().custom((body: any) => {
    const hasBasicData = body.first_name || body.last_name || body.email || body.phone || body.description;
    const hasExperiences = body.experiences && body.experiences.length > 0;
    const hasSkills = body.skills && body.skills.length > 0;
    const hasDocuments = body.documents && body.documents.length > 0;
    
    if (!hasBasicData && !hasExperiences && !hasSkills && !hasDocuments) {
      throw new Error("At least one field must be provided to update the profile");
    }
    
    return true;
  })
];
