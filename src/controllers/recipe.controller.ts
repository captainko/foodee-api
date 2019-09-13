import { Request, Response } from "express";

import { Recipe, IRecipe } from "../models/recipe.model";
import { Rating, IRating } from "../models/rating.model";


export class RecipeController {
  public static getRecipes(req: Request, res: Response) {
    Recipe.find({})
      .then((recipe) => res.json(recipe))
      .catch(error => res.json(error));
  }

  public static getRecipeByID(req: Request, res: Response) {
    console.log(req.params.id);
    
    Recipe.findById(req.params.id)
      .then((recipe) => res.json(recipe))
      .catch((error) => res.json(error))
  }

  public static createRecipe(req: Request, res: Response) {
    const { body } = req;
    Recipe.create({
      name: body.name,
      description: body.description,
      time: body.time,
    }).then((value) => res.json(value))
      .catch((error) => res.json(error));
  }

  public static async rateRecipe(req: Request, res: Response) {
    // check if user is already rate the product
    const ratingObj: IRating = await Rating.findOne({
      recipeId: req.params.id,
      userId: '5d7a3b1c01634c4fdc2d41e8',
    }).exec();
    if(!ratingObj) {
      Rating.create({
        userId: '5d7a3b1c01634c4fdc2d41e8',
        recipeId: req.params.id,
      });
    } else {
      ratingObj.rating = req.body.rating;
      const savedData = await ratingObj.save();
    }
  }

  public static removeAll(req: Request,res : Response) {
    Recipe.deleteMany({})
      .then(result => res.json(result))
      .catch(error => res.json(error));
  }
}