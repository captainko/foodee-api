import { Request, Response, NextFunction } from "express";
import { HTTP403Error } from "../util/httpErrors";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isUnauthenticated()) {
    throw new HTTP403Error();
  }
  next();
}