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
