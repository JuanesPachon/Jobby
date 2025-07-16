import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

function errorsIsEmpty(req: Request, res: Response, next: NextFunction) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array().map((error: { msg: string }) => error.msg) });
  } else {
    next()
  }
}

export default errorsIsEmpty;