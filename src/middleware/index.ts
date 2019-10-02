import { 
  handleCors,
  handleBodyRequest,
  handleSession,
  handleCompression,
  handlePassportSession,
 } from "./common";


 export default [handleCors, handleBodyRequest, handleCompression];