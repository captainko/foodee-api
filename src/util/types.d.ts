
declare namespace Express {
  export interface Request {
    payload?: any;
    user?: import('../models/user.model').IUser;
    recipe?: import('../models/recipe.model').IRecipe;
  }
  
  export interface Response {
    sendAndWrap(obj, key?: string): Response;
    sendMessage(str: string): Response;
    jsonAndWrap(obj, key?: string): Response;
  }
}
