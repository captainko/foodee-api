import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";

interface PreloadedRequest extends Request {
  payload?: any;
  user?: IUser,
}
export class MainFrameController {
  public static async getMainFrame({user}: PreloadedRequest, res: Response, next: NextFunction) {
    
    if(user)  {
      user = await user.populate('savedRecipes').populate('createdRecipes').execPopulate();
      return res.json(user)
    }
    res.send(200);
  }
}