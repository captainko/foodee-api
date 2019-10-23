import { Request, Response, NextFunction } from "express";
import { Http401Error } from "../util/httpErrors";


export class ImageController {
  public static uploadImage(req: Request, res: Response, next: NextFunction) {
    if(req.isUnauthenticated()) {
      throw new Http401Error;
    }
    res.sendAndWrap({id: req.file.filename});
  }
}