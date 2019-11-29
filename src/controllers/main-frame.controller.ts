import { Request, Response, NextFunction } from "express";
import { Recipe, IRecipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";

export class MainFrameController {
  public static async getMainFrame(req: Request, res: Response, next: NextFunction) {
    try {

      let { user } = req;
      const recipeFields = "id name image_url rating banners createdBy";

      // tslint:disable-next-line: max-line-length
      const newRecipes$ = Recipe.getNewRecipes().select(recipeFields).limit(20).then(x => x.toThumbnailFor(user));
      // tslint:disable-next-line: max-line-length
      const highRatedRecipes$ = Recipe.getHighRatedRecipes().select(recipeFields).limit(20).then(x => x.toThumbnailFor(user));
      const recommendRecipes$ = await Recipe.getRecommendRecipes();
        // .then(x => x.toThumbnailFor(user));
      const categories$ = Recipe.getCategories(5);

      const lists = await Promise.all([newRecipes$, highRatedRecipes$, recommendRecipes$, categories$]);
      const mainFrame = {
        newRecipes: lists[0],
        highRatedRecipes: lists[1],
        recommendRecipes: lists[2],
        categories: lists[3],
      };
      console.log(mainFrame.recommendRecipes[0].toJSON());
      if (req.isAuthenticated()) {
        user = await user
          .populate('savedRecipes', recipeFields)
          .populate('createdRecipes', recipeFields).execPopulate();
        // @ts-ignore
        mainFrame.savedRecipes = user.savedRecipes.toThumbnailFor(user);
        // @ts-ignore
        mainFrame.createdRecipes = user.createdRecipes.toThumbnailFor(user);
      }
      res.sendAndWrap(mainFrame, 'mainFrame');
    } catch (err) {
      next(err);
    }
  }

}

function toThumbnail(recipes: IRecipe[], user: IUser = null) {
  return recipes.map(r => r.toThumbnailFor(user));
}