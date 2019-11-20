
declare namespace Express {
  export interface Request {
    payload?: any;
    user?: import('../models/user.model').IUser;
    recipe?: import('../models/recipe.model').IRecipe;
    collection?: import('../models/collection.model').ICollection,
    file: FileCloudinary
  }
  
  export interface Response {
    sendAndWrap(obj: any, key?: string): Response;
    sendError(obj: any): Response;
    sendMessage(str: string): Response;
    jsonAndWrap(obj: any, key?: string): Response;
  }

  export interface FileCloudinary extends Multer.File {
    url: string;
    public_id: string;
    secure_url: string;
  }
}
