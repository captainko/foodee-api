import { Request, Response, NextFunction, } from "express";

import { Recipe } from "../models/recipe.model";
import { Rating } from "../models/rating.model";
import { HTTP404Error, HTTP403Error } from "../util/httpErrors";

export class RecipeController {

  public static preloadRecipe(req: Request, res: Response, next, id: string) {
    Recipe
      .findById(id)
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
    Recipe.paginate({
      category: req.params.category
    }).then(x => res.sendAndWrap(x))
      .catch(next);
  }

  public static getRecipeByID(req: Request, res: Response) {
    res.sendAndWrap(req.recipe);
  }

  public static createRecipe(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
      
    }
    const { body } = req;
    console.log(req.user);
    Recipe.create({
      name: body.name,
      category: body.category,
      description: body.description,
      banners: body.banners,
      time: body.time,
      servings: body.servings,
      status: body.status,
      ingredients: body.ingredients,
      createdBy: req.payload.id,
    })
      .then((recipe) => {
        console.log(req.user.username);
        req.user.createdRecipes.push(recipe._id);
        req.user.save().then(() => res.sendMessage('created successfully'));
      })
      .catch(next);
  }

  public static updateRecipe(req: Request, res: Response, next: NextFunction) {
    req.recipe.update(req.body)
      .then((value) => res.sendAndWrap(value, 'recipe'))
      .catch(next);
  }

  public static async rateRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const rateObj = await Rating.rate(req.payload.id, req.recipe._id, req.body.rateValue);
      const { user, recipe } = req;

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
      req.user.saveRecipe(req.recipe.id);
      await req.user.save();
      res.sendMessage('saved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async removeRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      req.user.removeRecipe(req.recipe.id);
      await req.user.save();
      res.sendMessage('remove successfully');
    } catch (err) {
      next(err);
    }
  }

  public static onlySameUserOrAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
      throw new HTTP403Error();
    }
    if (req.user.canEdit(req.recipe)) {
      next();
    } else {
      throw new HTTP403Error();
    }
  }

  public static onlyPermitted(req: Request, res: Response, next: NextFunction) {
    // public recipe
    if (req.recipe.status) { return next(); }

    if (req.isUnauthenticated()) {
      throw new HTTP403Error();
    }

    if (req.user.canEdit(req.recipe)) {
      return next();
    }

    throw new HTTP403Error();
  }

  public static removeAll(req: Request, res: Response, next: NextFunction) {
    Recipe.deleteMany({})
      .then(result => res.sendAndWrap(result))
      .catch(next);
  }
}
