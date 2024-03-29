import * as dotenv from "dotenv";
dotenv.config();

export const { 
  PORT = 3000,
  DB_URI,
  JWT_SECRET = 'secret',
  SESSION_SECRET = 'foodee-api',
} = process.env;

export const IS_PROD = false;
