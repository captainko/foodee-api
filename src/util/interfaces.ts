import { Request } from "express-serve-static-core";
import { IRecipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";

export interface PreloadedRequest extends Request {
  recipe?: IRecipe;
  payload?: any;
  user: IUser,
}