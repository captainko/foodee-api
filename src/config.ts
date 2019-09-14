import * as passport from "passport";
import * as passportLocal from "passport-local";
import { User } from "./models/user.model";

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, function(email, passport, done) {
  User.findOne({email}).then(function(user) => {
    if(!user || user.)
  })
}))