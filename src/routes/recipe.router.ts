import { Router } from 'express';

import { RecipeController as RecipeCtrl } from "../controllers/recipe.controller";
import { auth } from './auth';



const RecipeRouter = Router();
RecipeRouter.all('*', auth.optional).param('recipe', RecipeCtrl.preloadRecipe);
RecipeRouter.get('/', auth.optional, RecipeCtrl.getRecipes);
RecipeRouter.delete('/', RecipeCtrl.removeAll);
RecipeRouter.post('/', auth.required, RecipeCtrl.createRecipe);

RecipeRouter.get('/category/:category', RecipeCtrl.getRecipesByCategory);
RecipeRouter.get('/:recipe/', auth.optional, RecipeCtrl.onlyPermitted, RecipeCtrl.getRecipeByID);
RecipeRouter.put('/:recipe/', auth.required, RecipeCtrl.onlySameUserOrAdmin, RecipeCtrl.updateRecipe);

RecipeRouter.post('/:recipe/rating', auth.required, RecipeCtrl.rateRecipe);
RecipeRouter.post('/:recipe/save', auth.required, RecipeCtrl.onlySameUserOrAdmin, RecipeCtrl.saveRecipe);

RecipeRouter.delete('')


export { RecipeRouter };
