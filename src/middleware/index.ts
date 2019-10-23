import {
  handleCors,
  handleCookies,
  handleBodyRequest,
  handleSession,
  handleCompression,
  handlePassportSession,
} from "./common";


export default [
  handleCors,
  handleCompression,
  handleCookies,
  handleBodyRequest,
  handleSession,
  handlePassportSession,];