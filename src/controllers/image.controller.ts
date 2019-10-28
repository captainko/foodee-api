import { Request, Response, NextFunction } from "express";

export class ImageController {
  public static uploadImage(req: Request, res: Response, next: NextFunction) {
    res.sendAndWrap({id: req.file.filename});
  }
}