import { Response } from 'express';

function handleError(res: Response, statusCode: number, message: string) {
  res.status(statusCode).json({ error: message });
}

function handleAuthError(res: Response) {
  handleError(res, 403, "You do not have permission to perform this action");
}

function handleValidationError(res: Response) {
  handleError(res, 400, "Invalid input data");
}

function handleServerError(res: Response) {
  handleError(res, 500, "The server encountered an error");
}

function handleNotFoundError(res: Response, resource = "Resource") {
  handleError(res, 404, `${resource} not found`);
}

function handleDuplicateError(res: Response, message = "The resource already exists") {
  handleError(res, 409, message);
}

function handleInvalidCredentialsError(res: Response) {
  handleError(res, 401, "Invalid email or password");
}

export default {
  handleError,
  handleAuthError,
  handleValidationError,
  handleServerError,
  handleNotFoundError,
  handleDuplicateError,
  handleInvalidCredentialsError
};