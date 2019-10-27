// lib
import { Request, Response, NextFunction } from "express";

// app
import { Collection } from "../models/collection.model";
import { HTTP404Error } from "../util/httpErrors";
import { Recipe } from "../models/recipe.model";

export class CollectionController {
  public static preloadCollection(req: Request, res: Response, next: NextFunction, collectionId: string) {
    Collection
      .findById(collectionId)
      .then((collection) => {
        if (!collection) {
          throw new HTTP404Error('Collection not found');
        }
        req.collection = collection;
        return next();
      })
      .catch(next);
  }

  public static preloadRecipe(req: Request, res: Response, next: NextFunction, recipeId: string) {
    Recipe.findById(recipeId)
      .then((recipe) => {
        if (!recipe) {
          throw new HTTP404Error('Recipe not found');
        }

      })
      .catch(next);
  }

  public static async createCollection({ body, user }: Request, res: Response, next: NextFunction) {
    try {

      const collection = await Collection.create({
        name: body.name,
        createdBy: user.id,
      });
      
      await user.createCollection(collection.id).save();

      res.sendMessage('created successfully');
    } catch (err) {
      next(err);
    }
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
        res.sendAndWrap(collection, 'collection');
      })
      .catch(next);
  }

  public static onlySameUserOrAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user.canEdit(req.collection)) {

    }
  }
}