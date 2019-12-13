// lib
import { Document, Model, model, Schema, SchemaTypes, SchemaDefinition } from "mongoose";

// app
import { AdminUser, IAdminUser } from "./admin-user.model";
import { IAdminRecipe } from "./admin-recipe.model";

export interface ICollectionMethods {
  addRecipe(recipeId: string): IAdminCollection;
  removeRecipe(recipeId: string): IAdminCollection;
  toSearchResult(): Promise<IAdminCollection>;
  toDetailFor(user: IAdminUser): Promise<IAdminCollection>;
}

export interface IAdminCollection extends Document, ICollectionMethods {
  name?: string;
  createdBy?: string | IAdminUser;
  image_url?: string;
  recipes?: Array<string | IAdminRecipe>;
}

export interface IAdminCollectionModel extends Model<IAdminCollection> {

}

export const AdminCollectionFields = {
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: [true, ' is required'],

  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'admin-user',
    required: true,
  },
  recipes: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-recipe',
    }],
    default: [],
  },
};

export const AdminCollectionSchema = new Schema(
  AdminCollectionFields,
  // {
  //   versionKey: false,
  //   timestamps: true,
  //   toJSON: {
  //     virtuals: true,
  //     transform: (doc, ret) => {
  //       delete ret._id;
  //       delete ret.updatedAt;
  //       delete ret.createdAt;
  //     }
  //   },
  //   toObject: {
  //     virtuals: true,
  //     transform: (doc, ret) => {
  //       delete ret._id;
  //       delete ret.updatedAt;
  //       delete ret.createdAt;

  //     }
  //   },}
  );

AdminCollectionSchema.index({
  name: 'text',
}, {
  weights: {
    name: 10,
  }
});

AdminCollectionSchema.methods.addRecipe = function(this: IAdminCollection, recipeId: string) {
  if (-1 === this.recipes.findIndex((r: any) => r == recipeId || r.id == recipeId)) {
  this.recipes.push(recipeId);
  }

  return this;
};

AdminCollectionSchema.methods.removeRecipe = function(this: IAdminCollection, recipeId: string) {
  const index = this.recipes.findIndex((r: any) => r == recipeId || r.id == recipeId);
  this.recipes.splice(index, 1);

  return this;
};

// tslint:disable:max-line-length
export const AdminCollectionModel = model<IAdminCollection, IAdminCollectionModel>('admin-collection', AdminCollectionSchema, 'collections');

export { AdminCollectionModel as AdminCollection };