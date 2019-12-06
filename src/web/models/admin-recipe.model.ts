import {
  Schema,
  model,
  Document,
  SchemaTypes,
  DocumentQuery,
  Model,
  PaginateModel,
} from "mongoose";
import mongooseAutoPopulate = require('mongoose-autopopulate');
import mongoosePaginate = require('mongoose-paginate');
import { AdminRating, IAdminRating } from "./admin-rating.model";
import { IAdminUser,  AdminUser } from "./admin-user.model";
import { IAdminImage, AdminImage } from "./admin-image.model";
import { AdminCollection } from './admin-collection.model';

export interface ICategory {
  name: string;
  total: number;
  image_url: string;
}

export interface IAdminRecipe extends Document {
  name?: string;
  description?: string;
  status?: boolean; // true: public ~ false: private
  category?: string;
  createdBy?: string & IAdminUser;
  servings?: number;
  time?: number;
  tags?: string[];
  banners?: Array<string | IAdminImage>;
  image_url?: string;
  ingredients?: [{ quantity: string, ingredient: string }];
  methods?: string[];
  rating: { total: number, avg: number };
  ratings?: string[];
  createdAt?: string;
  updatedAt?: string;

  addRating(ratingId: string): IAdminRating;
  updateRating(): Promise<any>;
  isCreatedBy(user: string | IAdminUser): boolean;
  toJSONFor(user: IAdminUser): IAdminRecipe;
  toThumbnailFor(user?: IAdminUser): IAdminRecipe;
  toEditObj(): IAdminRecipe;
  toSearchResultFor(user?: IAdminUser): IAdminRecipe;
  populateBanners(): Promise<IAdminRecipe>;
  populateUser(): Promise<IAdminRecipe>;
}

export interface IAdminRecipeModel extends PaginateModel<IAdminRecipe> {
  getRecipesByCategory(category: string): DocumentQuery<IAdminRecipe[], IAdminRecipe, {}>;
  getCategories(limit?: number): Promise<Array<ICategory>>;
  getNewRecipes(): DocumentQuery<IAdminRecipe[], IAdminRecipe, {}>;
  getHighRatedRecipes(): DocumentQuery<IAdminRecipe[], IAdminRecipe, {}>;
}

export const RecipeFields = {
  name: {
    type: String,
    required: [true, 'is required'],
    trim: true,
  },
  category: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'is required'],
  },
  description: {
    type: String,
    trim: [true, 'is required'],
  },
  servings: {
    type: Number,
    min: 1,
    max: 16,
    required: [true, 'is required'],
  },
  time: {
    type: Number,
    min: 1,
    max: 200,
  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'admin-user',
    required: [true, 'is required'],
  },
  banners: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-image',
      // autopopulate: true,
      trim: true,
    }],
    minlength: 1,
    maxlength: 4,
    required: true,
  },
  ingredients: {
    type: [{
      _id: false,
      quantity: {
        type: String,
        required: [true, 'is required'],
        trim: true,
      },
      ingredient: {
        type: String,
        required: [true, 'is required'],
        trim: true,
      },
    }],
    default: [],
  },
  methods: {
    type: [String],
    required: true,
  },
  rating: {
    type: {
      avg: Number,
      total: Number,
    },
    default: {
      avgRating: 0,
      total: 0,
    }
  },
  ratings: {
    type: [{
      type: SchemaTypes.ObjectId,
      ref: 'admin-rating',
    }],
    default: [],
  },
  tags: {
    type: [String],
    trim: true,
    lowercase: true,
  }
};

export const RecipeSchema = new Schema<IAdminRecipe>(
  RecipeFields, {
  versionKey: false,
  timestamps: true,
});

RecipeSchema.plugin(mongooseAutoPopulate);

RecipeSchema.path('banners').validate({
  async validator(v) {
    return await AdminImage.checkImagesExist(v);
  },
  msg: 'Image not exists'
});

RecipeSchema.virtual('image_url').get(function(this: IAdminRecipe) {
  if (!this.banners.length) {
    return '';
  }
  // @ts-ignore
  return this.banners[0].url;
});

RecipeSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  'tags': 'text',
  'ingredients.ingredient': 'text',
}, {
  weights: {
    name: 10,
    description: 5,
    category: 7,
    tags: 6,
    'ingredients.ingredient': 6,
  }
});

// RecipeSchema.methods.toThumbnailFor = function(this: IRecipe, user?: IUser) {
//   const recipe = user ? this.toJSONFor(user) : this.toJSON();

//   delete recipe.createdBy;
//   delete recipe.banners;
//   delete recipe.createdAt;
//   delete recipe.ingredients;
//   delete recipe.methods;
//   delete recipe.servings;
//   delete recipe.description;
//   delete recipe.category;
//   delete recipe.tags;
//   delete recipe.time;
//   delete recipe.status;
//   return recipe;
// };

// RecipeSchema.methods.toSearchResultFor = function(this: IRecipe, user?: IUser) {
//   const recipe = user ? this.toJSONFor(user) : this.toJSON();

//   delete recipe.banners;
//   delete recipe.createdAt;
//   delete recipe.createdBy;
//   delete recipe.ingredients;
//   delete recipe.methods;
//   delete recipe.servings;
//   delete recipe.description;
//   delete recipe.category;
//   delete recipe.tags;
//   delete recipe.time;
//   delete recipe.status;
//   delete recipe.score;
//   return recipe;
// };

// RecipeSchema.methods.toEditObj = function(this: IRecipe) {
//   const recipe = {
//     ...this.toObject(),
//     banners: this.banners.map((x: IImage) => x.toEditObject())
//   };
//   delete recipe.createdBy;
//   delete recipe.createdAt;
//   delete recipe.rating;
//   delete recipe.image_url;
//   return recipe;
// };

// RecipeSchema.methods.isCreatedBy = function(this: IRecipe, user: IUser) {
//   if (!user) { return false; }
//   return this.createdBy == user.id;
// };

// RecipeSchema.methods.toJSONFor = function(this: IRecipe, user: IUser) {
//   const result = {
//     ... this.toJSON(),
//     savedByUser: false,
//     createdByUser: false,
//   };
//   if (user) {
//     result.savedByUser = user.didSaveRecipe(this);
//     result.createdByUser = this.isCreatedBy(user);
//   }
//   return result; 
// };

// RecipeSchema.methods.updateRating = async function(this: IRecipe) {
//   const results = await Rating.aggregate([
//     {
//       $match: {
//         recipeId: this._id
//       }
//     },
//     {
//       $group: {
//         _id: '$recipeId',
//         avg: { $avg: '$rateValue' },
//         total: { $sum: 1 },
//       }
//     },
//   ]);
//   delete results[0]._id;
//   this.rating = results[0];
//   return await this.save();
// };

// RecipeSchema.methods.populateUser = async function(this: IRecipe) {
//     await this.populate('createdBy', 'username').execPopulate();
//     return this;
// };

// RecipeSchema.methods.populateBanners = async function(this: IRecipe) {
//   await this.populate('banners').execPopulate();
//   return this;
// };

// RecipeSchema.methods.addRating = function(this: IRecipe, ratingId: string) {
//   if (!this.ratings.includes(ratingId)) {
//     this.ratings.push(ratingId);
//   }

//   return this;
// };

// RecipeSchema.statics.getCategories = async function(limit: number = null) {
//   const categories = await Recipe.aggregate([
//     {
//       $match: {
//         status: true,
//         category: { $ne: null }
//       }
//     },
//     {
//       $group: {
//         // _id: { $ifNull: ["$category", "Unknown"] },
//         _id: "$category",
//         total: { $sum: 1 },
//         // should change to first in product
//         image_url: { $last: { $arrayElemAt: ["$banners", 0] } },
//       }, // ~$group
//     },
//     // {
//     //   $limit: limit,
//     // }
//   ]);
//   return categories;
// };

// RecipeSchema.statics.getNewRecipes = function() {
//   return Recipe.find().sort('-createdAt');
// };

// RecipeSchema.statics.getHighRatedRecipes = function() {
//   return Recipe.find().sort({ "rating.total": -1, "rating.avg": -1 });
// };

// RecipeSchema.statics.getRecipesByCategory = function(category: string) {
//   return Recipe.find({ category });
// };

RecipeSchema.post("remove", function(this: IAdminRecipe) {
  console.log(typeof this._id);
  AdminUser.updateMany({
    $or: [
      { createdRecipes: { $in: [this.id] } },
      { savedRecipes: { $in: [this.id] } }
    ]}, {
    $pull: {
      createdRecipes: this._id,
      savedRecipes: this._id,
    }
  }).then(console.log);

  AdminCollection.updateMany({ recipes: { $in: [this.id] } }, {
    $pull: {
      recipes: this._id,
    }
  }).then(console.log);

  AdminRating.deleteMany({ recipeId: { $in: [this.id] } }).then(console.log);
  AdminImage.deleteMany({_id: {$in: [this.banners]}});
});

export const AdminRecipeModel = model<IAdminRecipe, IAdminRecipeModel>('admin-recipe', RecipeSchema, 'recipes');

export const AdminRecipe = AdminRecipeModel;

// tslint:disable-next-line: max-line-length
// aggregate([{$match: {$or : [{status: true}, {$and: [{status: false}, {createdBy: "5d96d8ccca60c720bcf45383"}]}]}}, {$project: {status:1, createdBy: 1}}])
