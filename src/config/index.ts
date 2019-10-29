import * as passport from "passport";
import * as passportLocal from "passport-local";
import express = require("express");
import { User } from "../models/user.model";
import "./extends";

// express
express.response.sendAndWrap = function(obj, key = 'data') {
  return this.send({
    status: this.statusCode,
    [key]: obj
  });
};

express.response.sendMessage = function(message) {
  return this.sendAndWrap(message, 'message');
};

express.response.sendError = function(error: any) {
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
  return this.sendAndWrap(res, 'error');
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
