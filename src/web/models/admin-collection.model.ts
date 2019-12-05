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

AdminCollectionSchema.post("remove", function(this: IAdminCollection) {
  AdminUser.updateMany({collection: {$in: [this._id]}}, {
    $pull: {
      collections: this._id,
    }
  }).then(console.log);  
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

// CollectionSchema.methods.toSearchResult = async function(this: ICollection) {
//   await this.populate({
//     path: 'recipes',
//     populate: { model: 'image', path: 'banners', options: { limit: 1 } },
//     options: { limit: 1 }
//   }).execPopulate();
//   console.log(this);
//   const result = {
//     ...this.toObject(),
//   };
//   if (this.recipes.length) {
//     // @ts-ignore
//     result.image_url = this.recipes[0].image_url;
//   }
//   // console.log(this.toObject());
//   console.log(result);
//   delete result.createdBy;
//   delete result.createdAt;
//   delete result.recipes;
//   delete result.score;
//   return result;
// };

// CollectionSchema.methods.toDetailFor = async function(this: ICollection, user: IUser) {
//   await this.populate({
//     path: 'recipes',
//     // populate: { model: 'image', path: 'banners', options: { limit: 1 } },
//     // options: { limit: 1 }
//   }).execPopulate();

//   console.log('called');
//   return {
//     ...this.toJSON(),
//     user: this.createdBy,
//     recipes: this.recipes.map((r: IRecipe) => r.toThumbnailFor(user)),
//   };
// };

// tslint:disable:max-line-length
export const AdminCollectionModel = model<IAdminCollection, IAdminCollectionModel>('admin-collection', AdminCollectionSchema, 'collections');

export { AdminCollectionModel as AdminCollection };