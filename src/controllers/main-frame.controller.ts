import { Request, Response, NextFunction } from "express";
import { Recipe, IRecipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";


export class MainFrameController {
  public static async getMainFrame(req: Request, res: Response, next: NextFunction) {
    let { user } = req;
    const recipeFields = "id name image_url rating banners";

    const newRecipes$ = Recipe.getNewRecipes().select(recipeFields).limit(20);
    const highRatedRecipes$ = Recipe.getHighRatedRecipes().select(recipeFields).limit(20);
    const categories$ = Recipe.getCategories(5);

    const lists = await Promise.all([newRecipes$, highRatedRecipes$, categories$])
    const mainFrame = {
      newRecipes: lists[0],
      highRatedRecipes: lists[1],
      categories: lists[2],
    }
    if (req.isAuthenticated()) {
      user = await user.populate('savedRecipes', recipeFields).populate('createdRecipes', recipeFields).execPopulate();
      // @ts-ignore
      mainFrame.savedRecipes = toThumbnail(user.savedRecipes, user);
      // @ts-ignore
      mainFrame.createdRecipes = toThumbnail(user.createdRecipes, user);
    }
    mainFrame.newRecipes = toThumbnail(mainFrame.newRecipes, user);
    mainFrame.highRatedRecipes = toThumbnail(mainFrame.highRatedRecipes, user);
    res.sendAndWrap(mainFrame, 'mainFrame');
  }

}

function toThumbnail(recipes: IRecipe[], user: IUser = null) {
  return recipes.map(r => r.toThumbnail(user));
}