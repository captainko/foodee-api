//lib
import { Request, Response, NextFunction } from "express";

//app
import { Collection } from "../models/collection.model";
import { HTTP404Error } from "../util/httpErrors";

export class CollectionController {
  public static preloadCollection(req: Request, res: Response, next: NextFunction, collectionId: string) {
    Collection
      .findById(collectionId)
      .then((collection) => {
        if (!collection) {
          throw new HTTP404Error();
        }
        req.collection = collection;
        return next();
      })
      .catch(next);
  }

  public static createCollection({ body }: Request, res: Response, next: NextFunction) {
    Collection.create({
      name: body.name
    })
      .then((collection) => {
        res.sendAndWrap(collection);
      })
      .catch(next);
  }

  public static getCollection({ collection }: Request, res: Response) {
    return res.sendAndWrap(collection, 'collection');
  }

  public static updateCollection(req: Request, res: Response, next: NextFunction) {
    const { body, collection } = req;
    if (body.name) {
      collection.name = body.name;
    }

    collection.save()
      .then((collection) => {
        res.sendAndWrap(collection);
      })
      .catch(next);
  }
}