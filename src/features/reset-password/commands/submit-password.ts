import { Request, Handler } from "express-serve-static-core";
import { User } from "../../../models";

export const submitPassword: Handler = async function(req, res) {
  try {

    const { password, confirm } = req.body;
    if (!password || password.length < 6) {
      return res.status(422).render('pages/reset-password', {
        password,
        confirm,
        errors: {
          password: 'Password must be at least 6 characters'
        }
      });
    }

    if (password !== confirm) {
      return res.status(422).render('pages/reset-password', {
        password,
        confirm,
        errors: {
          confirm: 'Password must be the same'
        }
      });
    }
    await req.user.setPassword(password);
    res.redirect('/reset-password-success');
  } catch (err) {
    res.redirect('404');
  }
};
