// lib
import { Request, Response, NextFunction } from "express";

// app
import { Collection } from "../models/collection.model";
import { HTTP404Error, HTTP403Error } from "../util/httpErrors";

export class CollectionController {
  public static preloadCollection(req: Request, res: Response, next: NextFunction, collectionId: string) {
    Collection
      .findById(collectionId)
      .then((collection) => {
        if (!collection) {
          throw new HTTP404Error('collection not found');
        }
        req.collection = collection;
        return next();
      })
      .catch(next);
  }

  public static async createCollection({ body, user }: Request, res: Response, next: NextFunction) {
    try {

      const collection = await Collection.create({
        name: body.name,
        createdBy: user.id,
      });
      res.sendAndWrap(collection, 'collection');
    } catch (err) {
      next(err);
    }
  }

  public static async getDetailCollection({ collection, user }: Request, res: Response, next: NextFunction) {
    // collection.populate('recipes').execPopulate()
    //   .then(c => res.sendAndWrap(c.toSearchResult(), 'collection'))
    //   .catch(next);
    try {
      const result = await collection.toDetailFor(user);
      res.sendAndWrap(result, 'collection');
    } catch (err) {
      next(err);
    }

    // return res.sendAndWrap(collection, 'collection');
  }

  public static updateCollection(req: Request, res: Response, next: NextFunction) {
    const { body, collection } = req;
    if (body.name) {
      collection.name = body.name;
    }

    collection.save()
      .then((collection) => {
        res.sendAndWrap(collection, 'collection');
      })
      .catch(next);
  }

  public static async deleteCollection(req: Request, res: Response, next: NextFunction) {
    try {
      await req.collection.remove();
      res.sendMessage("removed collection successfully");
    } catch (err) {
      next(err);
    }
  }

  public static async addRecipe(req: Request, res: Response, next: NextFunction) {
    const { collection, recipe } = req;
    try {
      const newCollection = await collection.addRecipe(recipe.id);
      res.sendAndWrap(await newCollection.toDetailFor(req.user), 'collection');
    } catch (err) {
      next(err);
    }

  }

  public static async removeRecipe(req: Request, res: Response, next: NextFunction) {
    const { collection, recipe } = req;
    try {
      const newCollection = await collection.removeRecipe(recipe.id);
      res.sendAndWrap(await newCollection.toDetailFor(req.user), 'collection');
    } catch (err) {
      next(err);
    }
  }

  public static onlySameUserOrAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user.canEdit(req.collection)) {
      throw new HTTP403Error();
    }
    next();
  }
}