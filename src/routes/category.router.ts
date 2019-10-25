import { Router } from "express";
import { CategoryController } from "@controllers/category.controller";

export const CategoryRouter = Router();

CategoryRouter.get('/', CategoryController.getCategories);
