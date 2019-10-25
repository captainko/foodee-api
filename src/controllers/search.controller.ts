import { Request, Response, NextFunction } from "express-serve-static-core";

import { Recipe } from "../models/recipe.model";

export class SearchController {
  
  public static searchRecipes(req: Request, res: Response, next: NextFunction) {
    if (req.query.q.length < 3) {
      res.sendAndWrap([], 'recipes');
    }
    const sorts = SearchController._sorts;

    let {
      page = 0,
      perPage = 5,
      // tslint:disable-next-line: prefer-const
      sortBy = 'score'
    } = req.query;
    page = +page;
    perPage = +perPage;
    const queries = {
      status: true,
      $text: {
        $search: req.query.q,
        $caseSensitive: false,
      }
    };
    const project = {
      score: { $meta: 'textScore' }
    };

    const counted = Recipe.find(queries).count();
    const paginated = Recipe.find(queries, project)
      // .sort({ [sortBy]: { $meta: "textScore" } })
      .sort(sorts[sortBy])
      .skip(page * perPage)
      .limit(perPage);

    Promise.all([counted, paginated])
      .then(([total, recipes]) => {
        const pages = Math.floor(total / perPage);
        let nextPage = page + 1;

        if (nextPage > pages) { nextPage = null; }

        if (req.isAuthenticated()) {
          recipes = recipes.map(r => r.toSearchResult(req.user));
        }
        res.sendAndWrap({ nextPage, pages, total, recipes }, 'paginate');
      }).catch(next);
  }
  // tslint:disable-next-line: variable-name
  private static _sorts = {
    name: { name: 1 },
    score: { score: -1 }, // relevant
    rating: { "rating.total": -1, "rating.avg": -1 },
  };
}