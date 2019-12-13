import { Request } from "express-serve-static-core";
import { IRecipe } from "../models/recipe.model";
import { IUser } from "../models/user.model";

// tslint:disable-next-line: interface-name
export interface PreloadedRequest extends Request {
  recipe?: IRecipe;
  payload?: any;
  user: IUser;
}

export interface ICategory {
  name: string;
  image_url: string;
  total: number;
  recipes: IRecipe[];
}

export interface IPaginateObj<T= any> {
  total: number;
  nextPage?: number | null;
  pages: number;
  docs: T[];
}