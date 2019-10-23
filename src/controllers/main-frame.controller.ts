import { Request, Response, NextFunction } from "express";
import { Recipe, IRecipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";


export class MainFrameController {
  public static async getMainFrame(req: Request, res: Response, next: NextFunction) {
    let {user} = req;
    const selectedField = "id name image_url rating banners";
    
    const newRecipes$ = Recipe.getNewRecipes().select(selectedField).limit(20);
    const highRatedRecipes$ = Recipe.getHighRatedRecipes().select(selectedField).limit(20);

    const recipes = await Promise.all([newRecipes$, highRatedRecipes$])
    const mainFrame = {
      newRecipes: recipes[0],
      highRatedRecipes: recipes[1],
    }
    if(req.isAuthenticated())  {
      let user = req.user;
      user = await user.populate('savedRecipes', selectedField).populate('createdRecipes', selectedField ).execPopulate();
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

// include fields used by virtuals


function toThumbnail(recipes: IRecipe[], user: IUser = null) {
  return recipes.map(r => r.toThumbnail(user));
}