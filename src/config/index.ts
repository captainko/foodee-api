import * as passport from "passport";
import * as passportLocal from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import express = require("express");
import { User } from "../models/user.model";
import "./extends";
import { JWT_SECRET } from "../environment";
import { IPaginateObj } from "../util/interfaces";

// express
express.response.sendAndWrap = function(this: express.Response, obj, key = 'data', message = 'success') {
  return this.send({
    status: this.statusCode,
    message,
    [key]: obj
  });
};

express.response.sendPaginate = function(this: express.Response, obj: IPaginateObj) {
  return this.send({
    message: 'success',
    status: this.statusCode,
    ...obj
  });
};

express.response.sendMessage = function(message) {
  return this.sendAndWrap(message, 'message');
};

express.response.sendError = function(this: Express.Response, error: any) {
  let res;
  if (error instanceof Object) {
    res = {};
    if (error.errors) {
      for (const key in error.errors) {
        if (error.errors.hasOwnProperty(key)) {
          const element = error.errors[key];
          res[key] = element.message;
        }
      }
    } else {
      res = error.toString();
    }
  } else {
    res = error;
  }
  return this.sendAndWrap(res, 'error', 'error');
};

// ~express

// passport
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Telling Passport where to find the secret
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
};

const jwtLogin = new JwtStrategy(jwtOptions, function(req, payload, done) {
  User.findById(payload.id, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      req.user = user; // <= Add this line
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
passport.use(jwtLogin);

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {

  User.findOneByEmailOrUsername(email).then((user) => {
    // user is found and check the password
    if (!user || !user.validPassword(password)) {
      return done(null, false, { message: 'email or password is invalid' });
    }
    return done(null, user);
  }).catch((err) => done(err, false, { message: 'mail or password is invalid' }));
}));

// ~ passport
