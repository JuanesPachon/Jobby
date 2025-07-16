import { NextFunction, Request, Response } from "express";
const { validationResult } = require('express-validator'); // Express-validator uses CommonJS, so we import it this way

function errorsIsEmpty(req: Request, res: Response, next: NextFunction) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array().map((error: { msg: string }) => error.msg) });
  } else {
    next()
  }
}

export default errorsIsEmpty;