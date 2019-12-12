import { Request, Handler } from "express-serve-static-core";
import { User } from "../../../models";

export const submitPassword: Handler = async function(req, res) {
  const {password, confirm} = req.body;
  if (!req.user.validPassword(password)) {
    return res.status(422).render('pages/reset-password', {
      password,
      confirm,
      errors: {
        password: 'password must be at least 6 characters'
      }
    });
  }
  res.render('pages/reset-password');
};
