import { Router } from 'express';

import { RecipeController } from "../controllers/recipe.controller";
import { auth } from './auth';



const RecipeRouter = Router();
RecipeRouter.all('*', auth.optional).param('recipe', RecipeController.preloadRecipe);
RecipeRouter.get('/', auth.optional, RecipeController.getRecipes);
RecipeRouter.delete('/', RecipeController.removeAll);
RecipeRouter.post('/', auth.required, RecipeController.createRecipe);
RecipeRouter.get('/search', RecipeController.searchRecipes);
RecipeRouter.get('/category/:category', RecipeController.getRecipesByCategory);
// RecipeRouter.param('recipe',RecipeController.preloadRecipe);
RecipeRouter.get('/:recipe', RecipeController.getRecipeByID);
RecipeRouter.post('/:recipe/rating', auth.required, RecipeController.rateRecipe);


export { RecipeRouter };
