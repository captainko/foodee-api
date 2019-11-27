import { Router } from 'express';

import { RecipeController as RecipeCtrl, RecipeController } from "../controllers/recipe.controller";
import { auth } from './auth';

const RecipeRouter = Router();
RecipeRouter.all('*').param('recipe', RecipeCtrl.preloadRecipe);
RecipeRouter.get('/', RecipeCtrl.getRecipes);
RecipeRouter.delete('/', RecipeCtrl.removeAll);
RecipeRouter.post('/', auth.required, RecipeCtrl.createRecipe);

RecipeRouter.get('/category/:category', RecipeCtrl.getRecipesByCategory);
RecipeRouter.get('/:recipe/', RecipeCtrl.getRecipeByID);
RecipeRouter.put('/:recipe/', auth.required, RecipeCtrl.onlySameUserOrAdmin, RecipeCtrl.updateRecipe);
RecipeRouter.delete('/:recipe', auth.required, RecipeCtrl.onlySameUserOrAdmin, RecipeController.deleteRecipe);

RecipeRouter.get('/:recipe/edit', auth.required, RecipeCtrl.onlySameUserOrAdmin, RecipeCtrl.getRecipeByIDToEdit);

RecipeRouter.post('/:recipe/rating', auth.required, RecipeCtrl.rateRecipe);
RecipeRouter.post('/:recipe/save', auth.required, RecipeCtrl.saveRecipe);
RecipeRouter.post('/:recipe/unsave', auth.required, RecipeCtrl.unsaveRecipe);

export { RecipeRouter };
