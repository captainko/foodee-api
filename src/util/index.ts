import { Response } from "express";
export function responseWithData(res: Response, data: any, message?:string) {
  const resData = {
    status: res.statusCode,
    data: data,
  }
}
