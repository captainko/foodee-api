import { Request, Response, NextFunction, } from "express";

import { Recipe } from "../models/recipe.model";
import { Rating } from "../models/rating.model";
import { HTTP404Error, HTTP403Error } from "../util/httpErrors";
import { checkIfExists } from "../util";

export class RecipeController {

  public static preloadRecipe(req: Request, res: Response, next, id: string) {
    Recipe
      .findById(id, {}, { autopopulate: false })
      .then((recipe) => {
        if (!recipe) {
          throw new HTTP404Error("recipe not found");
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

  public static async getRecipeByID({recipe, user}: Request, res: Response, next: NextFunction) {
    try {
      await Promise.all([
        recipe.populateBanners(),
        recipe.populateUser(),
      ]);
      res.sendAndWrap(recipe.toJSONFor(user));
    } catch (err) {
      next(err);
    }
  }

  public static async getRecipeByIDToEdit({ recipe }: Request, res: Response, next: NextFunction) {
    recipe = await recipe.populate('banners').execPopulate();
    res.sendAndWrap(recipe.toEditObj(), "recipe");
  }

  public static async createRecipe(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
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
        methods: body.methods,
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
    req.body.createdBy = req.user.id;
    req.recipe.updateOne(req.body)
      .then((value) => res.sendAndWrap(value, 'recipe'))
      .catch(next);
  }

  public static removeRecipe(req: Request, res: Response, next: NextFunction) {
    req.recipe.remove()
      .then(() => res.sendMessage("Deleted"))
      .catch(next);
  }

  public static async rateRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const rateObj = await Rating.rate(req.user.id, req.recipe.id, req.body.rateValue);
      const { user, recipe } = req;
      
      await Promise.all([user.addRating(rateObj._id), recipe.addRating(rateObj._id)]);

      await recipe.updateRating();

      return res.sendMessage('rated successfully');

    } catch (err) {
      next(err);
    }
  }

  public static async saveRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      await req.user.saveRecipe(req.recipe.id);
      res.sendMessage('saved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async unsaveRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      await req.user.unsaveRecipe(req.recipe.id);
      res.sendMessage("unsaved successfully");
    } catch (err) {
      next(err);
    }
  }

  public static async deleteRecipe({ recipe }: Request, res: Response, next: NextFunction) {
    try {
      await recipe.remove();
      res.sendMessage('removed successfully');

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
    return images.map(x => x.secure_url);
  } catch (error) {
    throw new Error(error.message);
  }
}
