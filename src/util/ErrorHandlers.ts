import { Response, NextFunction } from "express";
import { HTTPClientError, HTTP404Error } from "../util/httpErrors";
import { IS_PROD } from "../environment";


export const notFoundError = () => {
  throw new HTTP404Error('Method not found.');
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    console.warn(err);
    res.status(err.statusCode).send(err.message);
  } else {
    next(err);
  }
}

export const serverError = (err: Error, res: Response, next: NextFunction) => {
  console.error(err);
  if (IS_PROD) {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(500).send(err);
  }
}