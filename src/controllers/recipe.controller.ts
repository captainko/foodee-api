import { Request, Response, NextFunction, } from "express";

import { Recipe } from "../models/recipe.model";
import { Rating } from "../models/rating.model";
import { HTTP404Error, HTTP403Error } from "../util/httpErrors";
import { checkIfExists } from "../util";

export class RecipeController {

  public static preloadRecipe(req: Request, res: Response, next, id: string) {
    Recipe
      .findById(id, {},  {autopopulate: false})
      .then((recipe) => {
        if (!recipe) {
          throw new HTTP404Error();
        }
        req.recipe = recipe;
        return next();
      })
      .catch(next);
  }

  public static getRecipes(req: Request, res: Response, next: NextFunction) {
    Recipe.find()
      .then((recipe) => { res.sendAndWrap(recipe, 'recipes'); })
      .catch(next);
  }

  public static getRecipesByCategory(req: Request, res: Response, next: NextFunction) {
    const {
      perPage = 10,
      page = 0,
    } = req.query;
    Recipe.paginate({
      category: req.params.category
    }, {
      limit: perPage,
      offset: page,
    }).then(x => res.sendAndWrap(x))
      .catch(next);
  }

  public static getRecipeByID(req: Request, res: Response, next: NextFunction) {
    req.recipe.populate('createdBy', 'username')
      .execPopulate()
      .then(x => {
          if (req.isAuthenticated()) {
            x = x.toJSONFor(req.user);
          }
          res.sendAndWrap(x);
        })
      .catch(next);
  }

  public static getRecipeByIDToEdit({recipe}: Request, res: Response, next: NextFunction) {
   res.sendAndWrap(recipe.toEditObj(), "recipe");
  }

  public static async createRecipe(req: Request, res: Response, next: NextFunction) {
    const {body} = req;
    try {
      const recipe = await Recipe.create({
        name: body.name,
        category: body.category,
        description: body.description,
        banners: body.banners,
        time: body.time,
        servings: body.servings,
        ingredients: body.ingredients,
        createdBy: req.user.id,
      });
      await recipe.populate('banners').execPopulate();
      req.user.createRecipe(recipe.id);
      await req.user.save();
      res.sendAndWrap(recipe.toJSONFor(req.user), 'recipe');
    } catch (err) {
      next(err);
    }
  }

  public static updateRecipe(req: Request, res: Response, next: NextFunction) {    
    req.recipe.update(req.body)
      .then((value) => res.sendAndWrap(value, 'recipe'))
      .catch(next);
  }

  public static async rateRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const rateObj = await Rating.rate(req.user.id, req.recipe.id, req.body.rateValue);
      const { user, recipe } = req;
      console.log(recipe);
      recipe.addRating(rateObj._id);
      user.addRating(rateObj._id);

      await recipe.updateRating();

      await Promise.all([recipe.save(), user.save()]);

      return res.sendMessage('rated successfully');

    } catch (err) {
      next(err);
    }
  }

  public static async saveRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      req.user.saveRecipe(req.recipe);
      await req.user.save();
      res.sendMessage('saved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async unsaveRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      req.user.unsaveRecipe(req.recipe);
      await req.user.save();
      res.sendMessage('remove successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async deleteRecipe({user, recipe}: Request, res: Response, next: NextFunction) {
    try {
      // user.deleteRecipe(recipe.id);
     await recipe.remove();
    } catch (err) {
      next(err);
    }  
}

  public static onlySameUserOrAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
      throw new HTTP403Error();
    }
    if (!req.user.canEdit(req.recipe)) {
      throw new HTTP403Error();
    }
    return next();
  }

  public static onlyPermitted(req: Request, res: Response, next: NextFunction) {
    // public recipe
    if (req.recipe.status) { return next(); }

    if (req.isUnauthenticated()) {
      throw new HTTP403Error();
    }

    if (req.user.canEdit(req.recipe)) {
      throw new HTTP403Error();
    }

    return next();
  }

  public static removeAll(req: Request, res: Response, next: NextFunction) {
    Recipe.deleteMany({})
      .then(result => res.sendAndWrap(result))
      .catch(next);
  }
}

async function resolveImages(banners: string[]) {
  try {
    const images$ = banners.map(b => checkIfExists(b));
    const images = await Promise.all(images$);
    console.log(images);
    return images.map(x => x.secure_url);
  } catch (error) {
    throw new Error(error.message);
  }
}
