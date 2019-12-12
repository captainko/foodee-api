import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe.model";
import { HTTP404Error } from "../util/httpErrors";
import { ICategory } from "../util/interfaces";

export class CategoryController {
  public static async preloadCategory(req: Request, res: Response, next: NextFunction, category) {
    try {
      const result = await Recipe.getRecipesByCategory(req.params.name);
      if (!result.length) {
        throw new HTTP404Error("category not found");
      }
      req.category = {
        name: category,
        image_url: result[0].image_url,
        total: result.length,
        recipes: result.toThumbnailFor(req.user),
      };
      next();
    } catch (err) {
      next(err);
    }
  }

  public static getCategories(req: Request, res: Response, next: NextFunction) {
    Recipe.getCategories().then((result) => {
      res.sendAndWrap(result, 'categories');
    }).catch(next);
  }

  public static async getDetailCategoriesByName(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);
    res.sendAndWrap(req.category, 'category');
  }
}