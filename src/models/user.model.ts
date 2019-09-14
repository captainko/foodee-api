//lib
import { Document, Schema, model } from "mongoose";
import * as uniqueValidator from 'mongoose-unique-validator';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

//app
import { JWT_SECRET } from "../environment";
import { IIngredient } from "./ingredient.model";
import { IRecipe } from "./recipe.model";

export interface IAuthJSON {
  username: string;
  email: string;
  token: string;
  image_url: string;
}
export interface IUserMethods {
  addRating: (ratingId: string) => void;
  setPassword: (password: string) => void;
  validPassword: (password: string) => boolean;
  generateJWT: () => string;
  toAuthJSON: () => IAuthJSON;
}

export interface IUser extends Document, IUserMethods {
  username?: string;
  email?: string;
  image_url?: string;
  recipes?: IIngredient[];
  hash?: string;
  salt?: string;
  created_date?: string;
  updated_date?: string;
}

export const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'can\'t be blank'],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    unique: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  image_url: String,
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'recipe'
  }],
  hash: String,
  salt: String,
}, {
  versionKey: false,
  timestamps: true,
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });


UserSchema.methods.addRating = function (ratingId: string) {
  const user = this as IRecipe;
  if (!user.ratings.includes(ratingId)) {
    user.ratings.push(ratingId);
  }
};

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validPassword = function (password: string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
}

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: Math.floor(exp.getTime() / 1000),

  }, JWT_SECRET);
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image_url: this.image_url,
  }
}

export const UserModel = model<IUser>('user', UserSchema);
export const User = UserModel;