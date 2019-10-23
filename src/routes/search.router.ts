import { Router } from "express";
import { SearchController } from "../controllers/search.controller";

const SearchRouter = Router();

SearchRouter
  .get('/recipe', SearchController.searchRecipes)

export { SearchRouter };