import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { auth } from "./auth";

const UserRouter = Router();

UserRouter
  .get('/', auth.required, UserController.getLoggedUser)
  .get('/saved-recipes', auth.required, UserController.getSavedRecipes)
  .get('/created-recipes', auth.required, UserController.getCreatedRecipes)
  .get('/created-collections', auth.required, UserController.getCreatedCollections)
  .get('/confirmation/:token', UserController.verify)
  .put('/', auth.required, UserController.updateUser)
  .post('/signup', UserController.addUser)
  .post('/login', UserController.login)
  .post('/forgot-password', UserController.forgotPassword);

export { UserRouter };