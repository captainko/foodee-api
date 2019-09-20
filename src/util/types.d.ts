declare namespace Express {
  export interface Response {
    sendAndWrap(obj) : Response;
 }
}