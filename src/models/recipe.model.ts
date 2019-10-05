import {
  Schema,
  model,
  Document,
  SchemaTypes,
  PaginateModel,
  DocumentQuery
} from "mongoose";
import mongoosePagination = require('mongoose-paginate');
import { Rating, IRating } from "./rating.model";
import { IUser, User } from "./user.model";


export interface ICategory {
  _id: string,
  total: number,
  image_url: string,
}

export interface IRecipe extends Document {
  name?: string;
  description?: string;
  status?: boolean,// true: public ~ false: private
  category?: string,
  createdBy?: string,
  servings?: number;
  time?: number;
  tags?: string[];
  banners?: string[];
  image_url?: string;
  ingredients?: [{ quantity: string, ingredient: string }];
  totalRating: number;
  ratings?: string[];
  createdAt?: string;
  updatedAt?: string;

  toJSONFor: (user: IUser) => IRecipe;
  addRating: (ratingId: string) => IRating;
  updateRating: () => Promise<any>;
}

export interface IRecipeModel extends PaginateModel<IRecipe> {
  getCategories: () => Promise<Array<ICategory>>;
  getRecipesByCategory: (category: string) => DocumentQuery<IRecipe[], IRecipe, {}>;
  getPublicRecipes: () => DocumentQuery<IRecipe[], IRecipe, {}>;
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
    type: String,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'is required'],
  },
  banners: {
    type: [String],
    minlength: 1,
    maxlength: 4,
    required: true,
    trim: true,
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
  rating: {
    type: {
      avgRating: Number,
      totalRating: Number,
    },
    default: {
      avgRating: 0,
      totalRating: 0,
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
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.ratings;
      // delete ret.score;
      delete ret.createdAt;
      delete ret.updatedAt;
    }
  },
});
RecipeSchema.plugin(mongoosePagination);

RecipeSchema.virtual('image_url').get(function () {
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

RecipeSchema.methods.toJSONFor = function (user: IUser) {

  return {
    ... this.toObject(),
    savedByUser: user.savedRecipe(this._id),
    createdByUser: user._id === this.createdBy,
  };
}

RecipeSchema.methods.updateRating = async function () {
  let results = await Rating.aggregate([
    {
      $match: {
        recipeId: this._id
      }
    },
    {
      $group: {
        _id: '$recipeId',
        avgRating: { $avg: '$rateValue' },
        totalRating: { $sum: 1 },
      }
    }
  ]);
  delete results[0]._id;
  this.rating = results[0];
  return await this.save();
};

RecipeSchema.methods.addRating = function (ratingId: string) {
  if (!this.ratings.includes(ratingId)) {
    this.ratings.push(ratingId);
  }
  
  return this;
}

RecipeSchema.statics.getCategories = async function () {
  const categories = await Recipe.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$category", "Unknown"] },
        total: { $sum: 1 },
        image_url: { $last: { $arrayElemAt: ["$banners", 0] } },
      }, // ~$group
    }
  ]);
  return categories;
}

RecipeSchema.statics.getRecipesByCategory = function (category: string) {
  return Recipe.find({ category });
}

RecipeSchema.statics.getPublicRecipes = function() {
  return Recipe.find({status: true});
}

export const RecipeModel = model<IRecipe, IRecipeModel>('recipe', RecipeSchema);

export const Recipe = RecipeModel;


