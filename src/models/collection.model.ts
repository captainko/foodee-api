// lib
import { Document, Model, model, Schema, SchemaTypes } from "mongoose";

// app
import { PATH_IMAGE } from "../environment";
import { IUser } from "./user.model";
import { IRecipeModel, IRecipe } from "./recipe.model";

export interface ICollectionMethods {

}

export interface ICollection extends Document, ICollectionMethods {
  name?: string;
  createdBy?: string | IUser;
  image?: string;
  image_url?: string;
  recipes?: Array<string | ICollection>;
}

export interface ICollectionModel extends Model<ICollection> {
}

export const CollectionSchema = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: [true, 'is required'],
  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
  image: {
    type: String,
  },
  recipes: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'recipe',
    }],
    default: [],
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.image;
      delete ret.updatedAt;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.image;
      delete ret.updatedAt;
    }
  },
});

CollectionSchema.virtual('image_url').get(function(this: ICollection) {
  return this.image ? PATH_IMAGE + this.image : null;
});

CollectionSchema.methods.addRecipe = function(this: ICollection, recipeId: string) {
  this.recipes.push(recipeId);
  if (this.recipes.length === 1) {
    this.image = (this.recipes[0] as IRecipe).banners[0];
  }
  return this;
};

export const CollectionModel = model<ICollection, IRecipeModel>('collection', CollectionSchema);

export { CollectionModel as Collection };