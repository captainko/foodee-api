import { Request, Response, NextFunction, } from "express";

import { Recipe, IRecipe } from "../models/recipe.model";
import { Rating } from "../models/rating.model";
import { User, IUser } from "../models/user.model";
import { HTTP404Error, HTTP403Error } from "../util/httpErrors";
import { PreloadedRequest } from "../util/interfaces";
import { DocumentQuery } from "mongoose";

export class RecipeController {

  public static preloadRecipe(req: PreloadedRequest, res: Response, next, id: string) {
    // if(!id) return next();    
    Recipe
      .findById(id)
      .then((recipe) => {
        if (!recipe) {
          throw new HTTP404Error();
        }
        req.recipe = recipe;
        return next();
      })
      .catch(next);
  }

  public static getRecipes(req: Request, res: Response, next: NextFunction) {
    Recipe.find()
      .then((recipe) => { res.sendAndWrap(recipe, 'recipes') })
      .catch(next);
  }

  public static getRecipesByCategory(req: Request, res: Response, next: NextFunction) {
    Recipe.paginate({
      category: req.params.category
    }).then(x => res.sendAndWrap(x))
      .catch(next);
  }


  public static searchRecipes(req: PreloadedRequest, res: Response, next: NextFunction) {
    if (req.query.q.length < 3) {
      res.sendAndWrap([], 'recipes');
    }
    let {
      page = 0,
      perPage = 5,
    } = req.query;
    page = +page;
    perPage = +perPage;
    const queries = {
      $text: {
        $search: req.query.q,
        $caseSensitive: false,
      }
    }
    const project = {
      score: { $meta: 'textScore' }
    }

    const counted = Recipe.find(queries).count();
    const paginated = Recipe.find(queries, project)
      .sort({ score: { $meta: "textScore" } })
      .skip(page * perPage)
      .limit(perPage);
          
    Promise.all([counted, paginated])
      .then(([total, recipes]) => {
        const pages = Math.floor(total / perPage);
        let nextPage = page + 1;
        if (nextPage > pages) nextPage = null;
        if(req.user) {
          recipes = recipes.map(r =>r.toJSONFor(req.user));
        }
        res.sendAndWrap({ nextPage, pages, total, recipes }, 'paginate')
      }).catch(next);
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
        console.log(req.user.username);
        req.user.createdRecipes.push(recipe._id);
        req.user.save().then(() => res.sendMessage('created successfully'));
      })
      .catch(next);
  }

  public static updateRecipe(req: PreloadedRequest, res: Response, next: NextFunction) {
    req.recipe.update(req.body)
      .then((value) => res.sendAndWrap(value, 'recipe'))
      .catch(next);
  }

  public static async rateRecipe(req: PreloadedRequest, res: Response, next: NextFunction) {
    try {
      const rateObj$ = await Rating.rate(req.payload.id, req.recipe._id, req.body.rateValue);
      const user$ = User.findById(req.payload.id).exec();
      const recipe = req.recipe;

      const [rateObj, user] = await Promise.all([rateObj$, user$]);
      recipe.addRating(rateObj._id);
      user.addRating(rateObj._id);

      await recipe.updateRating();

      await Promise.all([recipe.save(), user.save()])

      return res.sendMessage('rated successfully');

    } catch (err) {
      next(err);
    }
  }

  public static async saveRecipe(req: PreloadedRequest, res: Response, next: NextFunction) {
    try {
      req.user.saveRecipe(req.recipe.id);
      await req.user.save();
      res.sendMessage('saved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static onlySameUserOrAdmin(req: PreloadedRequest, res: Response, next: NextFunction) {
    if (!req.user) {
      throw new HTTP403Error();
    }
    if (req.user.id === req.recipe.createdAt || req.user.admin) {
      next();
    } else
      throw new HTTP403Error();
  }


  public static onlyPermitted(req: PreloadedRequest, res: Response, next: NextFunction) {
    if (req.recipe.status) { return next() };
    if (!req.user) {
      throw new HTTP403Error();
    }
    if (req.user.admin || req.recipe.createdBy === req.user.id) {
      return next();
    }

    throw new HTTP403Error();
  }
  public static removeAll(req: Request, res: Response, next: NextFunction) {
    Recipe.deleteMany({})
      .then(result => res.sendAndWrap(result))
      .catch(next);
  }
}