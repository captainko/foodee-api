import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe.model";

export class CategoryController {

  public static getCategories(req: Request, res: Response, next: NextFunction) {
    Recipe.getCategories().then((result) => {
      res.sendAndWrap(result);
    }).catch(next)
  }

 
}