import { Request, Response, NextFunction } from "express-serve-static-core";

import { Recipe } from "../models/recipe.model";
import { Collection } from '../models/collection.model';
export class SearchController {

  public static searchRecipes(req: Request, res: Response, next: NextFunction) {
    if (req.query.q.length < 3) {
      return res.send({ docs: [], pages: 0, total: 0, nextPage: null, message: 'success', status: res.statusCode });
    }

    const sorts = SearchController._sorts;
    const {
      sortBy = 'score',
      minTime = 0,
      maxTime = 999,
      categories = [],
      q = '',
    } = req.query;

    let {
      page = 0,
      limit = 10,
    } = req.query;
    page = +page;
    limit = +limit;
    const queries: any = {
      $text: {
        $search: q,
        $caseSensitive: false,
      },
      time: { $gt: minTime, $lte: maxTime },
    };

    if (!categories.length) {
      queries.categories = { $in: categories };
    }
    const project = {
      score: { $meta: 'textScore' }
    };

    const counted$ = Recipe.find(queries).countDocuments();
    const paginated$ = Recipe.find(queries, project)
      // .sort({ [sortBy]: { $meta: "textScore" } })
      .skip(page * limit)
      .sort(sorts[sortBy])
      .limit(limit);

    Promise.all([counted$, paginated$])
      .then(([total, recipes]) => {
        const pages = Math.ceil(total / limit);
        let nextPage = page + 1;
        if (nextPage >= pages) {
          nextPage = null;
        }

        recipes = recipes.map(r => r.toSearchResultFor(req.user));
        res.send({ nextPage, pages, total, docs: recipes, message: 'success', status: res.statusCode});
      });
  }

  public static async searchCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q = ''
      } = req.query;

      if (req.query.q.length <= 3) {
        return res.send({ docs: [], pages: 0, total: 0, nextPage: null, message: 'success', status: res.statusCode, });
      }
      let {
        page = 0,
        limit = 10,
      } = req.query;
      page = +page;
      limit = +limit;

      const queries: any = {
        $text: {
          $search: q,
          $caseSensitive: false,
        },
      };

      const project = {
        score: { $meta: 'textScore' }
      };

      const counted$ = Collection.find(queries).countDocuments();
      const paginated$ = Collection.find(queries, project)
        .sort({ score: { $meta: 'textScore' } })
        .skip(page * limit)
        .limit(limit);

      // tslint:disable-next-line: prefer-const
      let [total, collections] = await Promise.all([counted$, paginated$]);
      const pages = Math.ceil(total / limit);
      let nextPage = page + 1;
      if (nextPage >= pages) {
        nextPage = null;
      }
      collections = await collections.toSearchResult();
      res.send({ nextPage, pages, total, docs: collections, message: 'success', status: res.statusCode });
    } catch (err) {
      next(err);
    }
  }

  // tslint:disable-next-line: variable-name
  private static _sorts = {
    name: { name: 1 },
    score: { score: { $meta: "textScore" } }, // relevant
    rating: { "rating.total": -1, "rating.avg": -1 },
  };
}