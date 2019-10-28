import { Router } from "express";
import { SearchController } from "../controllers/search.controller";
import { auth } from "./auth";

const SearchRouter = Router();

SearchRouter
  .get('/recipe', auth.optional, SearchController.searchRecipes);

export { SearchRouter };