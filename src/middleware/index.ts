import {
  handleCors,
  handleCookies,
  handleBodyRequest,
  handleCompression,
  handlePassportSession,
  // handleUpload,
} from "./common";

export default [
  handleCors,
  handleCompression,
  handleCookies,
  handleBodyRequest,
  // handleSession,
  handlePassportSession,
  // handleUpload,
];