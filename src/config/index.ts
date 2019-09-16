import * as passport from "passport";
import * as passportLocal from "passport-local";
import { User } from "../models/user.model";

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  User.findOne({ email }).then((user) => {
    // user is found and check the password
    if (!user || !user.validPassword(password)) {
      return done(null, false, {message: 'mail or password is invalid' });
    }
    return done(null, user);
  }).catch(done);
}));