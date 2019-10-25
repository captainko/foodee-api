//lib
import { Document, Schema, model, Model, DocumentQuery } from "mongoose";
import * as uniqueValidator from 'mongoose-unique-validator';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

//app
import { JWT_SECRET } from "../environment";
import { IRating } from "./rating.model";
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
  didCreateRecipe: (recipeId: string) => boolean;
  createRecipe: (recipeId: string) => IUser;
  canEdit: (this: IUser, recipe: IRecipe) => boolean
  saveRecipe: (this: IUser, recipeId: string) => IUser;
  removeRecipe: (this: IUser, recipeId: string) => IUser;
  didSaveRecipe: (recipeId: string) => boolean;
}

export interface IUser extends Document, IUserMethods {
  id: string;
  username?: string;
  admin?: boolean;
  email?: string;
  image_url?: string;
  createdRecipes?: Array<IRecipe | string>;
  savedRecipes?: Array<IRecipe | string>;
  ratings?: Array<IRating | string>;
  hash?: string;
  salt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserModel extends Model<IUser> {
  findOneByEmailOrUsername(term: string): DocumentQuery<IUser, IUser, {}>;
}

export const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'is required'],
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
    required: [true, 'is required'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  image_url: String,
  createdRecipes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'recipe'
    }]
  },
  savedRecipes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'recipe',
    }]
  },
  ratings: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'rating',
    }]
  },
  hash: String,
  salt: String,
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.ratings;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    }
  }
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });


UserSchema.methods.addRating = function(this: IUser, ratingId: string) {
  if (!this.ratings.includes(ratingId)) {
    this.ratings.push(ratingId);
  }
};

UserSchema.methods.saveRecipe = function(this: IUser, recipeId: string) {

  if (!this.savedRecipes.includes(recipeId)) {
    this.savedRecipes.unshift(recipeId);
  }
  return this;
};

UserSchema.methods.removeRecipe = function(this: IUser, recipeId: string) {
  //@ts-ignore
  const position = this.savedRecipes.findIndex(recipeId);
  if (position !== -1) {
    this.savedRecipes.splice(position, 1);
  }
  return this;
};

UserSchema.methods.createRecipe = function(this: IUser, recipeId) {
  this.createdRecipes.unshift(recipeId);
  return this;
};

UserSchema.methods.setPassword = function(this: IUser, password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(this: IUser, password: string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function(this: IUser) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: Math.floor(exp.getTime() / 1000),

  }, JWT_SECRET);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image_url: this.image_url,
  }
};

UserSchema.methods.didCreateRecipe = function(this: IUser, recipeId: string) {
  return this.createdRecipes.includes(recipeId);
};

UserSchema.methods.canEdit = function(this: IUser, recipe: IRecipe) {
  return this.id == recipe.createdBy || this.admin;
};

UserSchema.methods.didSaveRecipe = function(this: IUser, recipeId: string) {
  return this.createdRecipes.includes(recipeId);
};

UserSchema.statics.findOneByEmailOrUsername = function(term: string) {
  return User.findOne({ $or: [{ email: term }, { username: term }] });
};

export const UserModel = model<IUser, IUserModel>('user', UserSchema);
export const User = UserModel;