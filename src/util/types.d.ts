declare namespace Express {
  export interface Response {
    sendAndWrap(obj, key?: string): Response;
    jsonAndWrap(obj, key?: string): Response;
  }
}