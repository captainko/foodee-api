
declare namespace Express {
  export interface Request {
    payload?: any;
    recipe?: import('../models/recipe.model').IRecipe;
    collection?: import('../models/collection.model').ICollection;
    category?: import('../util/interfaces').ICategory;
  }

  
  export interface Response {
    sendAndWrap(obj: any, key?: string, message?: string): Response;
    sendError(obj: any): Response;
    sendMessage(str: string): Response;
    jsonAndWrap(obj: any, key?: string): Response;
  }

  type UserModel = import('../models/user.model').IUser
  export interface User extends UserModel{}
  export namespace Multer {
    interface File {
      url: string;
      public_id: string;
      secure_url: string;
    }
  } 
}
