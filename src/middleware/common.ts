// libs

import { Router } from "express";
import cors = require('cors');
import compression = require("compression");
import cookieParser = require('cookie-parser');
import session = require("express-session");
import bodyParser = require("body-parser");
import logger = require('morgan');
import * as connectMongo from 'connect-mongo';
import * as jsonwebtoken from "jsonwebtoken";
const MongoStore = connectMongo(session);

// app
import { IS_PROD, SESSION_SECRET, DB_URI, JWT_SECRET } from "../environment";
import passport = require("passport");
import { User } from "../models/user.model";

type Handle = (router: Router) => void;

export const handleCors: Handle = (router) => {
  router.use(cors());
};

export const handleBodyRequest: Handle = (router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
};

export const useLogger: Handle = (router) => {
  if (!IS_PROD) {
    router.use(logger('dev'));
  }
};

export const handleCompression: Handle = (router) => {
  if (IS_PROD) {
    router.use(compression());
  }
};

export const handleCookies: Handle = (router) => {
  router.use(cookieParser());
};

export const handleSession: Handle = (router) => {
  router.use(session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 },
    resave: true,
    // rolling: true,
    saveUninitialized: true,
    store: new MongoStore({ url: DB_URI })
  }));
};

export const handlePassportSession: Handle = (router) => {
  router.use(passport.initialize());
  router.use(function(req, res, next) {
    if (req.headers && req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(' ');
      if (type === 'Bearer') {
        jsonwebtoken.verify(token, JWT_SECRET, function(err, decode: any) {
          if (err) { 
            req.user = undefined; 
            next();
          } else {
             User.findById(decode.id).then(user => {
               req.user = user;
               next();
             });
          }
          
        });
      } else {
        req.user = undefined;
        next();  
      }
    } else {
      req.user = undefined;
      next();
    }
  });

};
