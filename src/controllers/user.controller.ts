//libs
import { Request, Response, NextFunction } from "express";
import passport = require("passport");
import { isUndefined } from "util";

// app
import { User } from "../models/user.model";

export class UserController {
  public static addUser(req: Request, res: Response, next: NextFunction) {
    const user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save().then(() => {
      return res.sendAndWrap({ user: user.toAuthJSON() });
    }).catch(e => {
      next(e);
    });
  }

  public static login(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    if (!body.email) {
      return res.status(422).json({ errors: { email: "is required" } });
    }

    if (!body.password) {
      return res.status(422).json({ errors: { password: "is required" } });
    }

    passport.authenticate('local', { session: true, }, (err, user, info) => {
      if (err) { return next(err) };

      if (user) {
        user.token = user.generateJWT();
        req.logIn(user, (err) =>{
          if(err) return next(err);
          return res.sendAndWrap({ user: user.toAuthJSON() });
        })
      } else {
        return res.status(422).sendAndWrap(info);
      }
    })(req, res, next);
  }

  public static getLoggedUser(req, res: Response, next: NextFunction) {
    User.findById(req.payload.id).then(user => {
      if (!user) { return res.sendStatus(401) }

      return res.sendAndWrap({user: user.toAuthJSON()});
    })
      .catch(next);
  }

  public static updateUser(req, res: Response, next: NextFunction) {
    User.findById(req.payload.id).then(user => {
      if (!user) { return res.sendStatus(401) }

      const { body } = req;
      if (!isUndefined(body.username)) {
        user.username = req.username;
      }
      if (!isUndefined(body.email)) {
        user.email = body.email;
      }
      if (!isUndefined(body.password)) {
        user.setPassword(body.password);
      }

      return user.save().then(() => {
        return res.sendAndWrap({user: user.toAuthJSON()});
      });
    }).catch(next);
  }
}