import { Request, Response, NextFunction, } from "express";

import { Recipe, IRecipe } from "../models/recipe.model";
import { Rating } from "../models/rating.model";
import { User, IUser } from "../models/user.model";
import { HTTP404Error, HTTP403Error } from "../util/httpErrors";

interface PreloadedRequest extends Request {
  recipe?: IRecipe;
  payload?: any;
  user: IUser,
}

export class RecipeController {

  public static preloadRecipe(req: PreloadedRequest, res: Response, next, id: string) {
    // if(!id) return next();    
    Recipe
      .findById(id)
      .then((recipe) => {
        if (!recipe) {
          throw new HTTP404Error();
        }

        if(!recipe.status  && recipe.createdBy !== req.payload.id) {
          console.log('error');
          throw new HTTP403Error();
        }
        req.recipe = recipe;
        return next();
      })
      .catch(next);
  }

  public static getRecipes(req: Request, res: Response, next: NextFunction) {
    Recipe.find()
      .then((recipe) => { res.json(recipe); console.log(recipe) })
      .catch(next);
  }

  public static getRecipesByCategory(req: Request, res: Response, next: NextFunction) {
    Recipe.paginate({
      category: req.params.category
    }).then(x => res.sendAndWrap(x))
    .catch(next);
  }

  public static searchRecipes({ query }: Request, res: Response, next: NextFunction) {
    if (query.q.length < 3) {
      res.json([]);
    }

    Recipe.find(
      { $text: { $search: query.q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .then((value) => res.sendAndWrap(value))
      .then(next);
  }

  public static getRecipeByID(req: PreloadedRequest, res: Response) {
    res.sendAndWrap(req.recipe);
  }

  public static createRecipe(req: PreloadedRequest, res: Response, next: NextFunction) {
    const { body } = req;
    Recipe.create({
      name: body.name,
      category: body.category,
      description: body.description,
      banners: body.banners,
      time: body.time,
      servings: body.servings,
      status: body.status,
      ingredients: body.ingredients,
      createdBy: req.payload.id,
    })
    .then((recipe) => {
      req.user.createdRecipes.push(recipe._id);
      req.user.save().then(() => res.sendAndWrap(recipe.toJSONFor(req.user), 'recipe'));
    })
      .catch(next);
  }

  public static updateRecipe(req: PreloadedRequest, res: Response, next: NextFunction) {
    req.recipe.update(req.body).then((value) => res.sendAndWrap(value, ))
  }

  public static async rateRecipe(req: PreloadedRequest, res: Response, next: NextFunction) {
    try {
      console.log('this',req.recipe);
      const rateObj$ = Rating.rate(req.payload.id, req.recipe._id, req.body.rateValue);
      const user$ = User.findById(req.payload.id).exec();
      const recipe = req.recipe;

      const [rateObj, user] = await Promise.all([rateObj$, user$]);
      recipe.addRating(rateObj._id);
      user.addRating(rateObj._id);

      await recipe.updateRating();

      await Promise.all([recipe.save(), user.save()])

      return res.sendAndWrap(recipe);

    } catch (err) {
      next(err);
    }

  }

  public static removeAll(req: Request, res: Response, next: NextFunction) {
    Recipe.deleteMany({})
      .then(result => res.sendAndWrap(result))
      .catch(next);
  }
}