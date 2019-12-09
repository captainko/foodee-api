// libs
import { Request, Response, NextFunction } from "express";
import passport = require("passport");
import { createTransport } from "nodemailer";
import jwt = require("jsonwebtoken");

// app
import { User, IUser } from "../models/user.model";
import { GMAIL_USER, GMAIL_PASS, EMAIL_SECRET } from "../environment";
import { Image } from "../models/image.model";
import { HTTP422Error } from "../util/httpErrors";
import { renderResetPassword, renderVerifiedEmail, renderConfirmEmail } from "../util/emailTemplate";
import { ICollection, Recipe } from "../models";

export class UserController {
  public static addUser(req: Request, res: Response, next: NextFunction) {
    const user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save().then(() => {

      jwt.sign(
        {
          user: user.id.toString(),
        },
        EMAIL_SECRET,
        {
          expiresIn: '1d',
        },
        (err, emailToken) => {

          transporter.sendMail({
            to: user.email,
            subject: 'Foodee - Confirm Email',
            html: renderConfirmEmail(user, emailToken),
          });
        },
      );
      return res.sendMessage("Please check your email before login");
    }).catch(next);
  }

  public static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const decoded = jwt.verify(req.params.token, EMAIL_SECRET) as any;
      console.log(decoded);
      await User.updateOne({ _id: decoded.user }, { isVerified: true });

      res.send("Email is verified");
      const user = await User.findById(decoded.user);
      transporter.sendMail({
        to: user.email,
        subject: 'Foodee - Verified Email',
        html: renderVerifiedEmail(user),
      });
    } catch (e) {
      res.send("Error");
    }
  }

  public static login(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    if (!body.email) {
      return res.status(422).json({ errors: { email: "is required" } });
    }

    if (!body.password) {
      return res.status(422).json({ errors: { password: "is required" } });
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) { return next(err); }

      if (user) {
        user.token = user.generateJWT();
        if (!user.isVerified) {
          return res.status(401).sendError(new Error("Account is not verified!"));
        }
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          return res.sendAndWrap(user.toAuthJSON(), 'user');
        });
      } else {
        return res.status(422).sendMessage(info.message);
      }
    })(req, res, next);
  }

  public static getLoggedUser(req: Request, res: Response, next: NextFunction) {
    return res.sendAndWrap(req.user.toAuthJSON(), 'user');
  }

  public static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      // tslint:disable-next-line
      let { body, user } = req;

      if (body.username) {
        user.username = body.username;
      }

      if (body.email) {
        user.email = body.email;
      }

      if (body.password) {
        user.setPassword(body.password);
      }

      if (body.image) {
        const isFound = await Image.checkImagesExist([body.image]);
        if (!isFound) {
          throw new HTTP422Error("Image not exists");
        }
        user.image_url = body.image;
      }

      user = await user.save();

      return res.sendAndWrap(user.toAuthJSON(), 'user');

    } catch (err) {
      next(err);
    }
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {

      const { email } = req.body;
      if (!email) {
        throw new HTTP422Error("email is required");
      }
      const user = await User.findOneByEmailOrUsername(email);
      if (!user) {
        throw new HTTP422Error("email not exists");
      }

      user.forgetsPassword();
      transporter.sendMail({
        from: 'Foodee',
        to: email,
        subject: 'Foodee - Reset Password',
        html: renderResetPassword(user),
      });
      res.sendMessage("Please checked your email");
    } catch (err) {
      next(err);
    }
  }

  public static resetPassword(req: Request, res: Response, next: NextFunction) {

  }

  public static getSavedRecipes(req: Request, res: Response, next: NextFunction) {
    req.user.populate('savedRecipes').execPopulate()
      .then((user) => {
        res.sendAndWrap(user.savedRecipes.toThumbnailFor(user), 'recipes');
      })
      .catch(next);
  }

  public static getCreatedRecipes(req: Request, res: Response, next: NextFunction) {
    let {
      page = 1,
      limit = 10,
      // tslint:disable-next-line: prefer-const
      q = '',
    } = req.query;
    page = +page;
    limit = +limit;
    console.log(q);
    Recipe.paginate({
      createdBy: req.user._id,
      name: {$regex: q, $options: 'i'}
    }, {
  page,
    limit,
    sort: { updatedAt: -1 },
}).then((page) => {
  page.docs = page.docs.toThumbnailFor(req.user);
  return page;
}).then((page) => res.send(page));
  }
  // req.user.populate('createdRecipes').execPopulate()
  //   .then((user) => {

  //     res.sendAndWrap(user.createdRecipes.toThumbnailFor(user), 'recipes');
  //   })
  //   .catch(next);

  public static async getCreatedCollections(req: Request, res: Response, next: NextFunction) {
  try {
    await req.user.populate('collections').execPopulate();
    res.sendAndWrap(await req.user.collections.toSearchResult(), 'collections');
  } catch (err) {
    next(err);
  }
}

  public static async getCreatedCollectionsWithRecipe(req: Request, res: Response, next: NextFunction) {
  const { user, recipe } = req;
  try {
    await user.populate('collections').execPopulate();
    const collections$ = user.collections.map(async (c: ICollection) => {
      const didSaveRecipe$ = c.didIncludeRecipe(recipe.id);
      const result$ = c.toSearchResult();
      const [isContained, result] = await Promise.all([didSaveRecipe$, result$]);
      result.didContainRecipe = isContained;
      return result;
    });

    res.sendAndWrap(await Promise.all(collections$), 'collections');
  } catch (err) {
    next(err);
  }
}
}

const transporter = createTransport({
  service: 'Gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});
