import { Router } from "express";
import { auth } from "./auth";
import { MainFrameController } from "../controllers/main-frame.controller";

export const MainFrameRouter = Router();

MainFrameRouter.get('/', auth.required,  MainFrameController.getMainFrame);

