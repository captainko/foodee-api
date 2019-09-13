import { Request, Response } from "express";
import { User, IUser, UserSchema } from "../models/user.model";
import { Types } from "mongoose";

export class UserController {
  public static async addUser(req: Request, res: Response) {
    const {body} = req;
    let user = new User({
      name: 'Thông1022',
      recipes: [
        new Types.ObjectId('5d7a3afa9d81774084188898'),
      ]
    })
    try {
      let doc =  await user.save();
      doc = await doc.populate('recipes').execPopulate();
      res.send(doc);
    }catch(e) {
      res.json(e);
    }
  }
}