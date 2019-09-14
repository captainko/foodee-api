import { Request, Response } from "express";
import { User } from "../models/user.model";

export class UserController {
  public static addUser(req: Request, res: Response, next) {
    const user = new User();
    user.email = req.body.email;
    user.username = req.body.email.split('@')[0];
    user.setPassword(req.body.password);

    user.save().then(() => {
      return res.json({ user: user.toAuthJSON() });
    }).catch(next);
  }
}