import { Router } from 'express';

import { RecipeController } from "../controllers/recipe.controller";



const RecipeRouter = Router();
RecipeRouter.get('/', RecipeController.getRecipes);
RecipeRouter.delete('/', RecipeController.removeAll);
RecipeRouter.post('/', RecipeController.createRecipe);
RecipeRouter.get('/:id', RecipeController.getRecipeByID);
RecipeRouter.post('/rating/:id', RecipeController.rateRecipe);


export { RecipeRouter };
