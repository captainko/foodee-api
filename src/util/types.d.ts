
declare namespace Express {
  export interface Response {
    sendAndWrap(obj, key?: string): Response;
    sendMessage(str: string): Response;
    jsonAndWrap(obj, key?: string): Response;
  }
}

