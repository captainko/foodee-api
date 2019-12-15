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
import { ICollection, Recipe, Collection } from "../models";

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
          return res.status(401).sendError(new Error("account is not verified!"));
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

      await user.forgetsPassword();
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

  public static async getSavedRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q = ''
      } = req.query;

      let {
        page = 0,
        limit = 10,
      } = req.query;
      page = +page;
      limit = +limit;

      const queries: any = {
        $and: [
          {
            _id: { $in: req.user.savedRecipes }
          },
          // { createdBy: req.user._id },
        ]

      };

      if (q) {
        queries.$and.push({
          $text: {
            $search: q,
            $caseSensitive: false,
          }
        });
      }

      const project = {
        score: { $meta: 'textScore' }
      };

      const counted$ = Recipe.find(queries).countDocuments();
      const paginated$ = Recipe.find(queries, project)
        .sort({ score: { $meta: 'textScore' } })
        .skip(page * limit)
        .limit(limit);

      // tslint:disable-next-line: prefer-const
      let [total, recipes] = await Promise.all([counted$, paginated$]);
      const pages = Math.ceil(total / limit);
      let nextPage = page + 1;
      if (nextPage >= pages) {
        nextPage = null;
      }
      recipes = recipes.map(c => c.toSearchResultFor(req.user));
      res.send({ nextPage, pages, total, docs: recipes });
    } catch (err) {
      next(err);
    }
  }

  public static async getCreatedRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q = ''
      } = req.query;

      let {
        page = 0,
        limit = 10,
      } = req.query;
      page = +page;
      limit = +limit;

      const queries: any = {
        $and: [
          {
            createdBy: req.user._id,
          },
          // { createdBy: req.user._id },
        ]

      };

      if (q) {
        queries.$and.push({
          $text: {
            $search: q,
            $caseSensitive: false,
          }
        });
      }

      const project = {
        score: { $meta: 'textScore' }
      };

      const counted$ = Recipe.find(queries).countDocuments();
      const paginated$ = Recipe.find(queries, project)
        .sort({ score: { $meta: 'textScore' } })
        .skip(page * limit)
        .limit(limit);

      // tslint:disable-next-line: prefer-const
      let [total, recipes] = await Promise.all([counted$, paginated$]);
      const pages = Math.ceil(total / limit);
      let nextPage = page + 1;
      if (nextPage >= pages) {
        nextPage = null;
      }
      recipes = recipes.map(c => c.toSearchResultFor(req.user));
      res.send({ nextPage, pages, total, docs: recipes });
    } catch (err) {
      next(err);
    }
  }

  public static async getCreatedCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q = ''
      } = req.query;

      let {
        page = 0,
        limit = 10,
      } = req.query;
      page = +page;
      limit = +limit;

      const queries: any = {
        $and: [
          {
            createdBy: req.user._id,
          },
          // { createdBy: req.user._id },
        ]

      };

      if (q) {
        queries.$and.push({
          $text: {
            $search: q,
            $caseSensitive: false,
          }
        });
      }

      const project = {
        score: { $meta: 'textScore' }
      };

      const counted$ = Collection.find(queries).countDocuments();
      const paginated$ = Collection.find(queries, project)
        .sort({ score: { $meta: 'textScore' } })
        .skip(page * limit)
        .limit(limit);

      // tslint:disable-next-line: prefer-const
      let [total, collections] = await Promise.all([counted$, paginated$]);
      const pages = Math.ceil(total / limit);
      let nextPage = page + 1;
      if (nextPage >= pages) {
        nextPage = null;
      }
      collections = await Promise.all(collections.map(c => c.toSearchResult()));
      res.send({ nextPage, pages, total, docs: collections });
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
