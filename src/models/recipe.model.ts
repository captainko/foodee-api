import {
  Schema,
  model,
  Document,
  SchemaTypes,
  PaginateModel,
  DocumentQuery,
  Collection
} from "mongoose";
import mongoosePagination = require('mongoose-paginate');
import { Rating, IRating } from "./rating.model";
import { IUser, User } from "./user.model";
import { PATH_IMAGE } from "../environment";

export interface ICategory {
  name: string;
  total: number;
  image_url: string;
}

export interface IRecipe extends Document {
  name?: string;
  description?: string;
  status?: boolean; // true: public ~ false: private
  category?: string;
  createdBy?: string & IUser;
  servings?: number;
  time?: number;
  tags?: string[];
  banners?: string[];
  image_url?: string;
  ingredients?: [{ quantity: string, ingredient: string }];
  methods?: string[];
  rating: { total: number, avg: number };
  ratings?: string[];
  createdAt?: string;
  updatedAt?: string;

  isCreatedBy: (user: string | IUser) => boolean;
  toJSONFor: (user: IUser) => IRecipe;
  toThumbnailFor: (user?: IUser) => IRecipe;
  toSearchResultFor: (user?: IUser) => IRecipe;
  addRating: (ratingId: string) => IRating;
  updateRating: () => Promise<any>;
}

export interface IRecipeModel extends PaginateModel<IRecipe> {
  getNewRecipes: () => DocumentQuery<IRecipe[], IRecipe, {}>;
  getHighRatedRecipes: () => DocumentQuery<IRecipe[], IRecipe, {}>;
  getPublicRecipes: () => DocumentQuery<IRecipe[], IRecipe, {}>;
  getCategories: (limit?: number) => Promise<Array<ICategory>>;
  getRecipesByCategory: (category: string) => DocumentQuery<IRecipe[], IRecipe, {}>;
}

export const RecipeSchema = new Schema<IRecipe>({
  name: {
    type: String,
    required: [true, 'is required'],
    trim: true,
  },
  category: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: [true, 'is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, 'is required'],
  },
  servings: {
    type: Number,
    required: [true, 'is required'],
  },
  time: {
    type: Number,
    min: 1,
    max: 200,
  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
    required: [true, 'is required'],
  },
  banners: {
    type: [String],
    minlength: 1,
    maxlength: 4,
    required: true,
    trim: true,
    get(banners) {
      return banners.map(b => PATH_IMAGE + b);
    }
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
      ref: 'rating',
    }],
    default: [],
  },
  tags: {
    type: [String],
    trim: true,
    lowercase: true,
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.ratings;
      // delete ret.score;
      // delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.ratings;
      // delete ret.score;
      // delete ret.createdAt;
      delete ret.updatedAt;
    }
  },
});
RecipeSchema.plugin(mongoosePagination);

RecipeSchema.virtual('image_url').get(function(this: IRecipe) {
  if (!this.banners) {
    return '';
  }
  return this.banners[0];
});

RecipeSchema.index({
  name: 'text',
  description: 'text',
  'ingredients.ingredient': 'text',
}, {
  weights: {
    name: 10,
    description: 5,
    'ingredients.ingredient': 5,
  }
});

RecipeSchema.methods.toThumbnailFor = function(this: IRecipe, user?: IUser) {
  const recipe = user ? this.toJSONFor(user) : this.toJSON();

  delete recipe.createdBy;
  delete recipe.banners;
  delete recipe.createdAt;
  delete recipe.ingredients;
  delete recipe.methods;
  delete recipe.servings;
  delete recipe.description;
  delete recipe.category;
  delete recipe.tags;
  delete recipe.time;
  delete recipe.status;
  return recipe;
};

RecipeSchema.methods.toSearchResultFor = function(this: IRecipe, user?: IUser) {
  const recipe = user ? this.toJSONFor(user) : this.toJSON();

  delete recipe.createdBy;
  delete recipe.banners;
  delete recipe.createdAt;
  delete recipe.createdBy;
  delete recipe.ingredients;
  delete recipe.methods;
  delete recipe.servings;
  delete recipe.description;
  delete recipe.category;
  delete recipe.tags;
  delete recipe.time;
  delete recipe.status;
  delete recipe.score;
  return recipe;
};

RecipeSchema.methods.isCreatedBy = function(this: IRecipe, user: IUser) {
  return this.createdBy == user.id;
};

RecipeSchema.methods.toJSONFor = function(this: IRecipe, user: IUser) {
  return {
    ... this.toObject(),
    savedByUser: user.didSaveRecipe(this),
    createdByUser: this.isCreatedBy(user),
  };
};

RecipeSchema.methods.updateRating = async function(this: IRecipe) {
  const results = await Rating.aggregate([
    {
      $match: {
        recipeId: this._id
      }
    },
    {
      $group: {
        _id: '$recipeId',
        avg: { $avg: '$rateValue' },
        total: { $sum: 1 },
      }
    },
  ]);
  delete results[0]._id;
  this.rating = results[0];
  return await this.save();
};

RecipeSchema.methods.addRating = function(this: IRecipe, ratingId: string) {
  if (!this.ratings.includes(ratingId)) {
    this.ratings.push(ratingId);
  }

  return this;
};

RecipeSchema.statics.getCategories = async function(limit: number = null) {
  const categories = await Recipe.aggregate([
    {
      $match: {
        status: true,
        category: { $ne: null }
      }
    },
    {
      $group: {
        // _id: { $ifNull: ["$category", "Unknown"] },
        _id: "$category",
        total: { $sum: 1 },
        // should change to first in product
        image_url: { $last: { $arrayElemAt: ["$banners", 0] } },
      }, // ~$group
    },
    // {
    //   $limit: limit,
    // }
  ]);
  return categories;
};

RecipeSchema.statics.getPublicRecipes = function() {
  return Recipe.where('status', true);
};

RecipeSchema.statics.getNewRecipes = function() {
  return Recipe.getPublicRecipes().sort('-createdAt');

  //  return Recipe.find().sort('-createdAt');
};

RecipeSchema.statics.getHighRatedRecipes = function() {
  return Recipe.getPublicRecipes().sort({ "rating.total": -1, "rating.avg": -1 });
};

RecipeSchema.statics.getRecipesByCategory = function(category: string) {
  return Recipe.getPublicRecipes().find({ category });
};

RecipeSchema.pre("remove", async function(this: IRecipe) {
  const users$ = User.find({ savedRecipes: { $contains: this.id } });
  const collections$ = Collection.find({ recipes: { $contains: this.id } });

});

export const RecipeModel = model<IRecipe, IRecipeModel>('recipe', RecipeSchema);

export const Recipe = RecipeModel;

// tslint:disable-next-line: max-line-length
// aggregate([{$match: {$or : [{status: true}, {$and: [{status: false}, {createdBy: "5d96d8ccca60c720bcf45383"}]}]}}, {$project: {status:1, createdBy: 1}}])
