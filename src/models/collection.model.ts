// lib
import { Document, Model, model, Schema, SchemaTypes } from "mongoose";

// app
import { IUser, User } from "./user.model";
import { IRecipe } from "./recipe.model";
import { COLLECTION_DEFAULT_IMG } from "../environment";

export interface ICollectionMethods {
  addRecipe(recipeId: string): Promise<ICollection>;
  removeRecipe(recipeId: string): Promise<ICollection>;
  toSearchResult(): Promise<ICollection>;
  toDetailFor(user: IUser): Promise<ICollection>;
  getLatest(): Promise<ICollection>;
  didIncludeRecipe(recipeId): Promise<boolean>;
}

export interface ICollection extends Document, ICollectionMethods {
  name?: string;
  createdBy?: string | IUser;
  image_url?: string;
  recipes?: Array<string | IRecipe>;
  didContainRecipe?: boolean;
}

export interface ICollectionModel extends Model<ICollection> {
  removeRecipeFromAll(recipeId): Promise<any>;
  removeRecipeFromUser(recipeId, userId): Promise<any>;
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
        delete ret.updatedAt;
        delete ret.createdAt;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;

      }
    },
  }
);

CollectionSchema.statics.removeRecipeFromAll = function(recipeId) {
  return CollectionModel.updateMany({
    recipes: recipeId
  }, {
    $pull: { recipes: recipeId }
  }).exec();
};

CollectionSchema.statics.removeRecipeFromUser = function(recipeId, userId) {
  return CollectionModel.updateMany({
    createdBy: userId,
    recipes: recipeId,
  }, {
    $pull: { recipes: recipeId }
  }).exec();
};

CollectionSchema.index({
  name: 'text',
}, {
  weights: {
    name: 10,
  }
});

CollectionSchema.post("remove", function(this: ICollection) {
  User.updateMany({ collections: this._id }, {
    $pull: {
      collections: this._id,
    }
  }).then(console.log);
});

CollectionSchema.methods.getLatest = function() {
  return CollectionModel.findById(this.id).exec();
};

CollectionSchema.methods.addRecipe = function(this: ICollection, recipeId: string) {
  // if (-1 === this.recipes.findIndex((r: any) => r == recipeId || r.id == recipeId)) {
  //   this.recipes.push(recipeId);
  // }

  // return this;
  return this.updateOne({
    $addToSet: {
      recipes: recipeId,
    }
  }).exec().then(() => this.getLatest());
};

CollectionSchema.methods.removeRecipe = function(this: ICollection, recipeId: string) {
  // const index = this.recipes.findIndex((r: any) => r == recipeId || r.id == recipeId);
  // this.recipes.splice(index, 1);

  // return this;

  return this.updateOne({
    $pull: {
      recipes: recipeId,
    }
  }).exec().then(() => this.getLatest);
};

CollectionSchema.methods.didIncludeRecipe = function(this: ICollection, recipeId: string) {
  return CollectionModel.findOne({ _id: this.id, recipes: recipeId }, "id").then((c) => !!c);
};

CollectionSchema.methods.toSearchResult = async function(this: ICollection) {
  await this.populate({
    path: 'recipes',
    populate: { model: 'image', path: 'banners', options: { limit: 1 } },
    options: { limit: 1 }
  }).execPopulate();
  const result = {
    ...this.toObject(),
    total: this.recipes.length,
  };
  if (this.recipes.length) {
    // @ts-ignore
    result.image_url = this.recipes[0].image_url;
  } else {
    result.image_url = COLLECTION_DEFAULT_IMG;
  }
  // console.log(this.toObject());
  delete result.createdBy;
  delete result.createdAt;
  delete result.recipes;
  delete result.score;
  return result;
};

CollectionSchema.methods.toDetailFor = async function(this: ICollection, user: IUser) {
  await this.populate([{
    path: 'recipes',
    // populate: { model: 'image', path: 'banners', options: { limit: 1 } },
    // options: { limit: 1 }
  }, {
    path: 'createdBy',
    select: 'username',
  }]).execPopulate();

  console.log('called');
  return {
    ...this.toJSON(),
    recipes: this.recipes.toThumbnailFor(user),
  };
};

export const CollectionModel = model<ICollection, ICollectionModel>('collection', CollectionSchema);

export { CollectionModel as Collection };