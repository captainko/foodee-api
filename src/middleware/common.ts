// libs
import { Router } from "express";
import cors = require('cors');
import compression = require("compression");
import session = require("express-session");
import bodyParser = require("body-parser");
import logger = require('morgan');

// app
import { IS_PROD, SESSION_SECRET } from "../environment";
import passport = require("passport");

type Handle = (router: Router) => void;


export const handleCors : Handle = (router) => {
  router.use(cors());
}

export const handleBodyRequest:Handle  = (router) => {
  router.use(bodyParser.urlencoded({extended: true}));
  router.use(bodyParser.json());
}

export const useLogger: Handle = (router) => {
  if (!IS_PROD) {
    router.use(logger('dev'));
  }
}

export const handleCompression : Handle = (router) => {
  if(IS_PROD) {
    router.use(compression());
  }
}

export const handleSession : Handle = (router) => {
  router.use(session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }));
}

export const handlePassportSession: Handle = (router) => {
  router.use(passport.initialize())
  router.use(passport.session());
}
