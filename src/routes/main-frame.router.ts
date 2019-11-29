import { Router } from "express";
import { auth } from "./auth";
import { MainFrameController } from "../controllers/main-frame.controller";
import passport = require("passport");

export const MainFrameRouter = Router();

// tslint:disable-next-line: max-line-length
MainFrameRouter.get('/', MainFrameController.getMainFrame);
