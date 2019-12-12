// lib
import { Router } from "express";
// app
import { ImageController } from "../../controllers/image.controller";
import { upload } from "../../middleware/upload";
import { auth } from "./auth";

export const ImageRouter = Router();

ImageRouter.post('/', auth.required, upload.single("image"), ImageController.uploadImage);
