
declare namespace Express {
  export interface Request {
    payload?: any;
    user?: import('../models/user.model').IUser;
    recipe?: import('../models/recipe.model').IRecipe;
    collection?: import('../models/collection.model').ICollection
  }
  
  export interface Response {
    sendAndWrap(obj: any, key?: string): Response;
    sendMessage(str: string): Response;
    jsonAndWrap(obj: any, key?: string): Response;
  }
}
