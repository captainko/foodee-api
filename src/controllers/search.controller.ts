import { Request, Response, NextFunction } from "express-serve-static-core";

import { Recipe } from "../models/recipe.model";
import { Collection } from '../models/collection.model';
export class SearchController {

  public static searchRecipes(req: Request, res: Response, next: NextFunction) {
    if (req.query.q.length < 3) {
      return res.sendPaginate({ docs: [], pages: 0, total: 0, nextPage: null });
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
      $and: [
        {
          $text: {
            $search: q,
            $caseSensitive: false,
          }
        },
        { time: { $gt: minTime, $lte: maxTime } },
      ]
    };

    if (categories.length) {
      queries.categories = { $in: categories };
    }

    console.log(queries);
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
      .then(([total, docs]) => {
        const pages = Math.ceil(total / limit);
        let nextPage = page + 1;
        if (nextPage >= pages) {
          nextPage = null;
        }

        docs = docs.toThumbnailFor(req.user);
        res.sendPaginate({ nextPage, pages, total, docs });
      });
  }

  public static async searchCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q = ''
      } = req.query;

      if (req.query.q.length <= 3) {
        return res.sendPaginate({ docs: [], pages: 0, total: 0, nextPage: null, });
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
      let [total, docs] = await Promise.all([counted$, paginated$]);
      const pages = Math.ceil(total / limit);
      let nextPage = page + 1;
      if (nextPage >= pages) {
        nextPage = null;
      }
      docs = await docs.toSearchResult();
      res.sendPaginate({ nextPage, pages, total, docs });
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