import { Router } from 'express';

import { RecipeController } from "../controllers/recipe.controller";
import { auth } from './auth';



const RecipeRouter = Router();
RecipeRouter.all('*', auth.optional).param('recipe', RecipeController.preloadRecipe);
RecipeRouter.get('/', auth.optional, RecipeController.getRecipes);
RecipeRouter.delete('/', RecipeController.removeAll);
RecipeRouter.post('/', auth.required, RecipeController.createRecipe);
RecipeRouter.get('/search', auth.optional, RecipeController.searchRecipes);
RecipeRouter.get('/category/:category', RecipeController.getRecipesByCategory);
// RecipeRouter.param('recipe',RecipeController.preloadRecipe);
RecipeRouter.get('/:recipe/', auth.optional, RecipeController.onlyPermitted, RecipeController.getRecipeByID);
RecipeRouter.put('/:recipe/', auth.required, RecipeController.onlySameUserOrAdmin, RecipeController.updateRecipe);

RecipeRouter.post('/:recipe/rating', auth.required, RecipeController.rateRecipe);
RecipeRouter.post('/:recipe/save', auth.required, RecipeController.onlySameUserOrAdmin, RecipeController.saveRecipe);

RecipeRouter.delete('')


export { RecipeRouter };
