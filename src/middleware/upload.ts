import multer = require("multer");
import cloudinary = require("cloudinary");
import cloudinaryStorage = require("multer-storage-cloudinary");
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../environment";

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, './src/public/uploads/');
//   },
//   filename(req, file, cb) {
//     cb(null, Date.now() + '.' + file.originalname.split('.').pop());
//   }
// });
// const storage = multer.memoryStorage();
cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
const storage = cloudinaryStorage({
  cloudinary,
  folder: "foodee",
  format: "jpg",
  allowedFormats: ["jpg", "png"],

});
// cloudinary.v2.api.resource()
// const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
//   if (acceptedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported Filetype'), false);
//   }
// };

export const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  storage,
});
