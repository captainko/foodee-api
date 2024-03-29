import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { auth } from "./auth";

const UserRouter = Router();

UserRouter
  .get('/', auth.required, UserController.getLoggedUser)
  .put('/', auth.required, UserController.updateUser)
  .post('/signup', UserController.addUser)
  .post('/login', UserController.login);

export { UserRouter };