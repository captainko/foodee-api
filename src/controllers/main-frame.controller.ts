import { Request, Response, NextFunction } from "express";
import { Recipe, IRecipe } from "../models/recipe.model";
import { IUser, User } from "../models/user.model";

export class MainFrameController {
  public static async getMainFrame(req: Request, res: Response, next: NextFunction) {
    try {

      let { user } = req;
      const recipeFields = "id name image_url rating banners createdBy";

      // tslint:disable-next-line: max-line-length
      const newRecipes$ = Recipe.getNewRecipes().select(recipeFields).limit(20).then(x => x.toThumbnailFor(user));
      // tslint:disable-next-line: max-line-length
      const highRatedRecipes$ = Recipe.getHighRatedRecipes().select(recipeFields).limit(20).then(x => x.toThumbnailFor(user));
      // tslint:disable-next-line: max-line-length
      const recommendRecipes$ = Recipe.getRecommendRecipes().then(x => x.toThumbnailFor(user));
      const categories$ = Recipe.getCategories(5);
      const collections$ = user ? user.getCollections(10).then(collections => collections.toSearchResult()) : [];
      
      // tslint:disable-next-line: max-line-length
      const lists = await Promise.all([newRecipes$, highRatedRecipes$, recommendRecipes$, categories$, collections$]);
      const mainFrame: any = {
        newRecipes: lists[0],
        highRatedRecipes: lists[1],
        recommendRecipes: lists[2],
        categories: lists[3],
        collections: lists[4],
      };

      if (req.isAuthenticated()) {
        user = await user.
          populate({
            path: 'savedRecipes createdRecipes',
            select: recipeFields,
            options: {
              limit: 10,
            }
          }).execPopulate();
        console.log(user);

        mainFrame.savedRecipes = user.savedRecipes.toThumbnailFor(user);
        mainFrame.createdRecipes = user.createdRecipes.toThumbnailFor(user);
      }
      res.sendAndWrap(mainFrame, 'mainFrame');
    } catch (err) {
      next(err);
    }
  }

}
