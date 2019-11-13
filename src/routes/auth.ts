import * as jwt from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../environment';
import {  } from 'connect';

function getTokenFromHeader(req: Request) {
  const authorization = req.headers.authorization;
  if (authorization) {
    const [bearer, token] = authorization.split(' ');
    if (bearer === 'Token' || bearer === 'Bearer') {
      return token;
    }
  }
  return null;
}

export const auth = {
  required(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
      throw new jwt.UnauthorizedError("credentials_required", {message: 'Unauthorized'});
    }
  }
};
