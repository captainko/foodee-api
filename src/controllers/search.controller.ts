import { Request, Response, NextFunction } from "express-serve-static-core";

import { Recipe } from "../models/recipe.model";
import { Collection } from '../models/collection.model';
export class SearchController {

  public static searchRecipes(req: Request, res: Response, next: NextFunction) {
    if (req.query.q.length < 3) {
      return res.sendAndWrap({ recipes: [], pages: 0, total: 0, nextPage: null }, 'paginate');
    }

    const sorts = SearchController._sorts;
    const {
      sortBy = 'score',
      minTime = 0,
      maxTime = 200,
      categories = [],
      q = '',
    } = req.query;

    let {
      page = 0,
      perPage = 10,
    } = req.query;
    page = +page;
    perPage = +perPage;
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
      .skip(page * perPage)
      .sort(sorts[sortBy])
      .limit(perPage);

    Promise.all([counted$, paginated$])
      .then(([total, recipes]) => {
        const pages = Math.ceil(total / perPage);
        let nextPage = page + 1;
        if (nextPage >= pages) {
          nextPage = null;
        }

        recipes = recipes.map(r => r.toSearchResultFor(req.user));
        res.sendAndWrap({ nextPage, pages, total, recipes }, 'paginate');
      });
  }

  public static async searchCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q = ''
      } = req.query;

      if (req.query.q.length <= 3) {
        return res.sendAndWrap({ recipes: [], pages: 0, total: 0, nextPage: null }, 'paginate');
      }
      let {
        page = 0,
        perPage = 10,
      } = req.query;
      page = +page;
      perPage = +perPage;

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
        .skip(page * perPage)
        .limit(perPage);

      // tslint:disable-next-line: prefer-const
      let [total, collections] = await Promise.all([counted$, paginated$]);
      const pages = Math.ceil(total / perPage);
      let nextPage = page + 1;
      if (nextPage >= pages) {
        nextPage = null;
      }
      collections = await Promise.all(collections.map(c => c.toSearchResult()));
      res.sendAndWrap({ nextPage, pages, total, collections }, 'paginate');
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