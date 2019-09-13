import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.post('/signup', UserController.addUser);

export { UserRouter };