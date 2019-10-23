import * as passport from "passport";
import * as passportLocal from "passport-local";
import { User } from "../models/user.model";


passport.serializeUser((user: any, done) => {
  console.log('id', user.id);
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  console.log('id2', id);

  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  User.findOne({ email }).then((user) => {
    // user is found and check the password
    if (!user || !user.validPassword(password)) {
      return done(null, false, { message: 'email or password is invalid' });
    }
    return done(null, user);
  }).catch((err) =>done(err, false,{ message: 'mail or password is invalid' }));
}));



