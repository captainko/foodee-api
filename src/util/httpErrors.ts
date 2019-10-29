import { IS_PROD } from "../environment";

export abstract class HTTPClientError extends Error {
  public readonly statusCode!: number;
  public readonly name!: string;

  constructor(message: object | string) {
    console.log('lol',message);
    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }

    this.name = this.constructor.name;
    if (!IS_PROD) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class HTTP400Error extends HTTPClientError {
  public readonly statusCode = 400;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

export class Http401Error extends HTTPClientError {
  public readonly statusCode = 401;

  constructor(message: string |object = "Unauthorized") {
    super(message);
  }
}

export class HTTP403Error extends HTTPClientError {
  public readonly statusCode = 403;

  constructor(message: string |object = "Access Denied") {
    super(message);
  }
}

export class HTTP404Error extends HTTPClientError {
  public readonly statusCode = 404;

  constructor(message: string | object = 'Not Found') {
    super(message);
  }
}

export class HTTP422Error extends HTTPClientError {
  public readonly statusCode = 422;
  constructor(message: string | object = 'Validation Error') {
    super(message);
  }
}