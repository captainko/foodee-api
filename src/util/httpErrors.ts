import { IS_PROD } from "../environment";

export abstract class HTTPClientError extends Error {
  readonly statusCode!: number;
  readonly name!: string;

  constructor(message: object | string) {

    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }

    this.name = this.constructor.name;
    if(!IS_PROD) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class HTTP400Error extends HTTPClientError {
  readonly statusCode = 400;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

export class HTTP404Error extends HTTPClientError {
  readonly statusCode = 404;

  constructor(message: string | object = 'Not Found') {
    super(message);
  }
}