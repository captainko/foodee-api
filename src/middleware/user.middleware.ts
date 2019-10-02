import { User } from "../models/user.model";

export const userMiddleware = (req, res, next) => {
  if (!req.payload) {
    return next();
  }

  User.findById(req.payload.id)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
};
