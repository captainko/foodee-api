import { HandleFunction } from "connect";
import { User } from "../../../models";
import { Request, Response, RequestParamHandler } from "express-serve-static-core";

export const verifiedUser: RequestParamHandler = async function(req, res, next, token) {
  if (!token) {
    return res.redirect('/404');
  }
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.redirect('/404');
  }

  req.user = user;

  next();
};