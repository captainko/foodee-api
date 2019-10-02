import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { upload } from "../middleware/upload";

export const ImageRouter = Router();

ImageRouter.post('/', upload.single('image'), ImageController.uploadImage);
