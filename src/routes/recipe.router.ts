import { Router } from 'express';

import { RecipeController } from "../controllers/recipe.controller";
import { auth } from './auth';
import { userMiddleware } from '../middleware/user.middleware';



const RecipeRouter = Router();
RecipeRouter.all('*', auth.optional).param('recipe', RecipeController.preloadRecipe);
RecipeRouter.get('/', auth.optional, RecipeController.getRecipes);
RecipeRouter.delete('/', RecipeController.removeAll);
RecipeRouter.post('/', auth.required, userMiddleware, RecipeController.createRecipe);
RecipeRouter.get('/search', RecipeController.searchRecipes);
RecipeRouter.get('/category/:category', RecipeController.getRecipesByCategory);
// RecipeRouter.param('recipe',RecipeController.preloadRecipe);
RecipeRouter.get('/:recipe', RecipeController.getRecipeByID);
RecipeRouter.put('/:recipe', RecipeController.updateRecipe);
RecipeRouter.delete('')
RecipeRouter.post('/:recipe/rating', auth.required, userMiddleware, RecipeController.rateRecipe);


export { RecipeRouter };
