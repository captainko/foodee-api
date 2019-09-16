import { Request, Response, Router } from "express";

import { Recipe, IRecipe } from "../models/recipe.model";
import { Rating } from "../models/rating.model";
import { User } from "../models/user.model";

interface PreloadedRequest extends Request {
  recipe?: IRecipe;
  payload?: any;
}

export class RecipeController {

  public static preloadRecipe(req, res: Response, next, id: string) {
    // if(!id) return next();
    console.log('lol');
    Recipe
      .findById(id)
      .then((recipe) => {
        if (!recipe) {
          return res.sendStatus(404);
        }
        req.recipe = recipe;
        console.log(req.recipe);
        return next();
      })
      .catch(next);
  }

  public static getRecipes(req: Request, res: Response) {
    Recipe.find()
      .populate('ingredients')
      .then((recipe) => {res.json(recipe); console.log(recipe)})
      .catch(error => res.status(500).json(error));
  }

  public static getRecipeByID(req: PreloadedRequest, res: Response) {
    res.json(req.recipe);
  }

  public static createRecipe(req: Request, res: Response) {
    const { body } = req;
    Recipe.create({
      name: body.name,
      description: body.description,
      time: body.time,
    }).then((value) => res.json(value.toObject({ virtuals: true })))
      .catch((error) => res.json(error));
  }

  public static async rateRecipe(req: PreloadedRequest, res: Response, next) {
    try {
      console.log(req.recipe);
      const rateObj$ = Rating.rate(req.payload.id, req.recipe._id, req.body.rateValue);
      const user$ = User.findById(req.payload.id).exec();
      const recipe = req.recipe;

      const [rateObj, user] = await Promise.all([rateObj$, user$]);
      recipe.addRating(rateObj._id);
      user.addRating(rateObj._id);

      await recipe.updateRating();

      await Promise.all([recipe.save(), user.save()])

      return res.json(recipe);

    } catch (e) {
      next(e);
    }

  }

  public static removeAll(req: Request, res: Response) {
    Recipe.deleteMany({})
      .then(result => res.json(result))
      .catch(error => res.json(error));
  }
}