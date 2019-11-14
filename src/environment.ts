import * as dotenv from "dotenv";
dotenv.config();

export const { 
  NODE_ENV = 'production',
  PORT = 4500,
  DB_URI,
  JWT_SECRET = 'secret',
  SESSION_SECRET = 'foodee-api',
  EMAIL_SECRET = 'foodee-email',
  PATH_IMAGE = '/public/uploads/',
  GMAIL_USER = 'akstartforme@gmail.com',
  GMAIL_PASS = '65689099'
  
} = process.env;

export const IS_PROD = NODE_ENV === 'production';
