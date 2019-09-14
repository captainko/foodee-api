import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export {
  PORT,
  DB_URI,
  JWT_SECRET,
}