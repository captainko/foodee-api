import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";

interface PreloadedRequest extends Request {
  payload?: any;
  user?: IUser,
}
export class MainFrameController {
  public static async getMainFrame(req: PreloadedRequest, res: Response, next: NextFunction) {

    if(req.user)  {
      Recipe.getRecipesFor(req.user.id).exec((err, recipes) => {
        if(err)
         return next(err)
        res.sendAndWrap(recipes.map((r)=>r.toJSONFor(req.user)), 'recipes');
      });
    }
  }
}