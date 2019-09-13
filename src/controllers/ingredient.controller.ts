import { Request, Response  } from "express";
import { Ingredient } from "../models/ingredient.model";


export class IngredientController {
  public static async getIngredients(req: Request, res: Response)  {
    try {
      const ingredients = await Ingredient.find()
      throw new Error('lol');
      res.json(ingredients);
    }catch(e) {
      res.json(e);
    }
  }
}