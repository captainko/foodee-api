import * as jwt from 'express-jwt';
import { Request } from 'express';
import { JWT_SECRET } from '../environment';


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
  required: jwt({
    secret: JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
    credentialsRequired: true
  }),
  optional: jwt({
    secret: JWT_SECRET,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  })
};

