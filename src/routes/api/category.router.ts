import { Router } from "express";
import { CategoryController } from "../../controllers/category.controller";

export const CategoryRouter = Router();

CategoryRouter.all('*').param('name', CategoryController.preloadCategory);

CategoryRouter.get('/:name', CategoryController.getDetailCategoriesByName);
CategoryRouter.get('/', CategoryController.getCategories);
