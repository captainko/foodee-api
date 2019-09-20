import { Request, Response, NextFunction, Router } from "express";

import * as ErrorHandlers from "../util/ErrorHandlers";

type Handle = (router: Router) => void;

const handle404Error: Handle = (router) => {
  router.use((req, res) => {
    ErrorHandlers.notFoundError();
  });
};

const handle422Error: Handle = (router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandlers.validationError(err, res, next);
  });
}

const handleClientErrors: Handle = (router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandlers.clientError(err, res, next);
  });
};

const handleServerErrors: Handle = (router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandlers.serverError(err, res, next);
  });
};

export const errorHandlers = [
  handle404Error,
  handle422Error,
  handleClientErrors,
  handleServerErrors,
]