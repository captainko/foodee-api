import {
  handleCors,
  handleCookies,
  handleBodyRequest,
  handleCompression,
  handlePassportSession,
} from "./common";

export default [
  handleCors,
  handleCompression,
  handleCookies,
  handleBodyRequest,
  // handleSession,
  handlePassportSession,
];