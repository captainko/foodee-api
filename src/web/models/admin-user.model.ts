// lib
import { Document, Schema, model, Model, DocumentQuery, SchemaTypes, SchemaDefinition } from "mongoose";
import * as uniqueValidator from 'mongoose-unique-validator';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
// app
import { JWT_SECRET } from "../../environment";

// const validator;

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
  // didCreateRecipe: (recipe: IRecipe) => boolean;
  // createRecipe: (recipeId: string) => IUser;
  // deleteRecipe: (recipeId: string) => IUser;
  // createCollection: (collectionId: string) => IUser;
  // deleteCollection: (collectionId: string) => IUser;
  // canEdit: (this: IUser, recipe: IRecipe | ICollection) => boolean;
  // saveRecipe: (this: IUser, recipe: IRecipe) => IUser;
  // unsaveRecipe: (this: IUser, recipe: IRecipe) => IUser;
  // didSaveRecipe: (recipe: IRecipe) => boolean;
}

export interface IAdminUser extends Document, IUserMethods {
  id: string;
  username?: string;
  isVerified?: boolean;
  admin?: boolean;
  email?: string;
  image_url?: string;
  createdRecipes?: Array<any | string>;
  savedRecipes?: Array<any | string>;
  collections?: Array<any | string>;
  ratings?: Array<any | string>;
  hash?: string;
  salt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminUserModel extends Model<IAdminUser> {
  findOneByEmailOrUsername(term: string): DocumentQuery<IAdminUser, IAdminUser, {}>;
}

export const UserFields: SchemaDefinition = {
  username: {
    type: String,
    required: [true, 'is required'],
    match: [/^[a-zA-Z0-9]+$/, 'includes special characters.'],
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
  isVerified: { type: Boolean, default: false },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  image_url: {
    
      type: SchemaTypes.ObjectId,
      ref: 'admin-image'

  },
  createdRecipes: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-recipe'
    }],
    default: [],
  },
  savedRecipes: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-recipe',
    }],
    default: [],
  },
  ratings: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-rating',
    }]
  },
  collections: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-collection',
    }],
    default: [],
  },
  hash: String,
  salt: String,
};

export const AdminUserSchema = new Schema<IAdminUser>(UserFields);

AdminUserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// AdminUserSchema.methods.addRating = function(this: IUser, ratingId: string) {
//   if (!this.ratings.includes(ratingId)) {
//     this.ratings.push(ratingId);
//   }
// };

// AdminUserSchema.methods.saveRecipe = function(this: IUser, recipe: IRecipe) {
//   console.log(this);
//   if (!this.didSaveRecipe(recipe)) {
//     this.savedRecipes.unshift(recipe.id);
//   }
//   return this;
// };

// AdminUserSchema.methods.unsaveRecipe = function(this: IUser, recipe) {
//   // @ts-ignore
//   const position = this.savedRecipes.findIndex((r: IRecipe) => r == recipe.id || recipe.id == r.id);
//   if (position !== -1) {
//     this.savedRecipes.splice(position, 1);
//   }
//   return this;
// };

// AdminUserSchema.methods.createRecipe = function(this: IUser, recipeId) {
//   this.createdRecipes.unshift(recipeId);
//   return this;
// };

// AdminUserSchema.methods.deleteRecipe = function(this: IUser, recipeId) {
//   // delete recipe from all collections

//   // @ts-ignore
//   const position = this.createdRecipes.findIndex(recipeId);
//   if (position !== -1) {
//     this.createdRecipes.splice(position, 1);
//   }
//   return this;
// };

// AdminUserSchema.methods.createCollection = function(this: IUser, collectionId) {
//   this.collections.unshift(collectionId);
//   return this;
// };

// AdminUserSchema.methods.deleteCollection = function(this: IUser, collectionId) {

//   // @ts-ignore
//   const position = this.savedRecipes.findIndex(collectionId);
//   if (position !== -1) {
//     this.savedRecipes.splice(position, 1);
//   }
//   return this;
// };

AdminUserSchema.methods.setPassword = function(this: IAdminUser, password) {

  if (!password || password.length < 6) {
    this.invalidate('password', 'must be at least 6 characters.');
    return;
  }
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

AdminUserSchema.methods.validPassword = function(this: IAdminUser, password: string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

AdminUserSchema.methods.generateJWT = function(this: IAdminUser) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: Math.floor(exp.getTime() / 1000),
  }, JWT_SECRET);
};

AdminUserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image_url: this.image_url,
  };
};

// AdminUserSchema.methods.didCreateRecipe = function(this: IUser, recipe: IRecipe) {
//   return this.createdRecipes
//     .findIndex(
//       (r: any) => r == recipe.id || r.id == recipe.id
//     ) !== -1;
// };

// AdminUserSchema.methods.canEdit = function(this: IUser, doc: IRecipe | ICollection) {
//   return this.id == doc.createdBy || this.admin;
// };

// AdminUserSchema.methods.didSaveRecipe = function(this: IUser, recipe: IRecipe) {
//   return this.savedRecipes
//     .findIndex(
//       (r: any) => r == recipe.id || r.id == recipe.id
//     ) !== -1;
// };

AdminUserSchema.statics.findOneByEmailOrUsername = function(term: string) {
  return AdminUserModel.findOne({ $or: [{ email: term }, { username: term }] });
};

export const AdminUserModel = model<IAdminUser, IAdminUserModel>('admin-user', AdminUserSchema, 'users');
export { AdminUserModel as AdminUser };