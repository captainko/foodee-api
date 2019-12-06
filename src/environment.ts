import * as dotenv from "dotenv";
dotenv.config();

export const { 
  NODE_ENV = 'production',
  SERVER_PORT = 4500,
  WEB_PORT = 80,
  DB_URI,
  JWT_SECRET = 'secret',
  SESSION_SECRET = 'foodee-api',
  EMAIL_SECRET = 'foodee-email',
  PATH_IMAGE = '/public/uploads/',
  GMAIL_USER = 'foodeeapplication@gmail.com',
  GMAIL_PASS = 'foodee123',
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  SSL_PASSPHRASE,
} = process.env;

export const IS_PROD = NODE_ENV === 'production';
export const WEB_URL = IS_PROD ? 'https://foodee.cf' : 'http://localhost'; 