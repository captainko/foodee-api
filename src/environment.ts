import * as dotenv from "dotenv";
dotenv.config();

export const { 
  NODE_ENV,
  PORT = 3000,
  DB_URI,
  JWT_SECRET = 'secret',
  SESSION_SECRET = 'foodee-api',
  PATH_IMAGE = '/public/uploads/'
} = process.env;

console.log(process.env.NODE_ENV);

export const IS_PROD = NODE_ENV === 'production';
