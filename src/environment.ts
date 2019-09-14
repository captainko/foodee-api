import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'foodee-api'
export const IS_PROD = process.env.NODE_ENV === 'production';
