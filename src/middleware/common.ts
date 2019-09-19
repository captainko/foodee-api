// libs
import { Router } from "express";
import session = require("express-session");
import bodyParser = require("body-parser");
import logger = require('morgan');

// app
import { IS_PROD, SESSION_SECRET } from "../environment";

type Handle = (router: Router) => void;


export const handleCors : Handle = (router) => {
  // cors
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
  if(!IS_PROD) {
    // compression
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

