import multer = require("multer");
import { Request } from "express";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './src/public/uploads/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname.split('.').pop());
  }
});

const acceptedTypes = ['image/jpeg', 'image/png'];

const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported Filetype'), false);
  }
};

export const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter,
  storage,
});
