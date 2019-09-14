import { Request, Response, Router } from "express";

import { Recipe, IRecipe } from "../models/recipe.model";
import { Rating, IRating } from "../models/rating.model";

export interface IRecipeRequest extends Request {
  recipe: IRecipe;
}

export class RecipeController {
  
  public static preloadRecipe(req, res: Response, next, id: string) {
    Recipe
      .findById(id)
      .populate('ratings')
      .then((recipe) => {
        if(!recipe) {
          return res.sendStatus(404);
        }
        req.recipe = recipe;
        return next();
      })
      .catch(next);
  }

  public static getRecipes(req: Request, res: Response) {
    Recipe.find({})
      .then((recipe) => res.json(recipe.map(x => x.toObject({ virtuals: true }))))
      .catch(error => res.json(error));
  }

  public static getRecipeByID(req: IRecipeRequest, res: Response) {
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

  public static async rateRecipe(req: Request, res: Response) {
    // check if user is already rate the product
    console.log(req.params.id);

    const ratingObj: IRating = await Rating.findOne({
      recipeId: req.params.id,
      userId: '5d7a3b1c01634c4fdc2d41e8',
    }).exec();
    if (!ratingObj) {
      let ratingObj = await Rating.create({
        userId: '5d7a3b1c01634c4fdc2d41e8',
        recipeId: req.params.id,
        rating: req.body.rating,
      });
      await ratingObj.populate('recipeId userId').execPopulate();
      res.json(ratingObj);
    } else {
      ratingObj.rateValue = req.body.rating;
      const savedData = await ratingObj.save();
      res.json(await savedData.populate('recipeId').populate('userId').execPopulate());
    }
  }

  public static removeAll(req: Request, res: Response) {
    Recipe.deleteMany({})
      .then(result => res.json(result))
      .catch(error => res.json(error));
  }
}