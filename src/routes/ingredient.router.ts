import { Router } from "express";
import { IngredientController } from "../controllers/ingredient.controller";


const IngredientRouter  = Router();

IngredientRouter.get('/', IngredientController.getIngredients);

export {
  IngredientRouter
}