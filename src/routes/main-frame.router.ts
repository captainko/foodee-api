import { Router } from "express";
import { auth } from "./auth";
import { MainFrameController } from "../controllers/main-frame.controller";
import { userMiddleware } from "../middleware/user.middleware";

export const MainFrameRouter = Router();

MainFrameRouter.get('/', auth.optional, userMiddleware, MainFrameController.getMainFrame);

