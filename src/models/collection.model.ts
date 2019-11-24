// lib
import { Document, Model, model, Schema, SchemaTypes, SchemaDefinition } from "mongoose";

// app
import { IUser } from "./user.model";
import { IRecipe } from "./recipe.model";

export interface ICollectionMethods {
}

export interface ICollection extends Document, ICollectionMethods {
  name?: string;
  createdBy?: string | IUser;
  image_url?: string;
  recipes?: Array<string | IRecipe>;
  addRecipe(recipeId: string): ICollection;
  removeRecipe(recipeId: string): ICollection;
  toSearchResult(): ICollection;
}

export interface ICollectionModel extends Model<ICollection> {

}

export const CollectionFields = {
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: [true, ' is required'],

  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
  recipes: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'recipe',
    }],
    default: [],
  },
};

export const CollectionSchema = new Schema(
  CollectionFields,
  {
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

CollectionSchema.index({
  name: 'text',
}, {
  weights: {
    name: 10,
  }
});

CollectionSchema.methods.addRecipe = function(this: ICollection, recipeId: string) {
  this.recipes.push(recipeId);

  return this;
};

CollectionSchema.methods.removeRecipe = function(this: ICollection, recipeId: string) {
  const index = this.recipes.findIndex((r: any) => r == recipeId || r.id == recipeId);
  this.recipes.splice(index, 1);

  return this;
};

CollectionSchema.methods.toSearchResult = async function(this: ICollection) {
  await this.populate({
    path: 'recipes',
    populate: { model: 'image', path: 'banners', options: { limit: 1 } },
    options: { limit: 1 }
  }).execPopulate();
  console.log(this.recipes);
  const result = {
    ...this.toObject(),
  };
  if (this.recipes.length) {
    // @ts-ignore
    result.image_url = this.recipes[0].image_url;
  }
  console.log(result);
  delete result.createdBy;
  delete result.createdAt;
  delete result.recipes;
  delete result.score;
  return result;
};

export const CollectionModel = model<ICollection, ICollectionModel>('collection', CollectionSchema);

export { CollectionModel as Collection };