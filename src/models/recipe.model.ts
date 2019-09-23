import { Schema, model, Document, SchemaTypes, Model, PaginateModel } from "mongoose";
import mongoosePagination = require('mongoose-paginate');
import { Rating, IRating } from "./rating.model";


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
  time?: string;
  banners?: string[];
  image_url?: string,
  ingredients?: [{ quantity: string, ingredient: string }];
  totalRating: number;
  ratings?: string[],
  createdDate?: string;
  updatedDate?: string;

  addRating: (ratingId: string) => IRating;
  updateRating: () => Promise<any>;
}

export interface IRecipeModel extends PaginateModel<IRecipe> {
  getCategories: () => Promise<Array<ICategory>>;
  getRecipesByCategory: (category: string) => Promise<Array<IRecipe>>;
}

export const RecipeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'is required'],
    trim: true,
  },
  category: {
    type: String,
    lowercase: true,
    unique: true,
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
    required: [true, 'is required'],
  },
  banners: [String],
  image_url: {
    type: String,
    required: [true, 'is required'],
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
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.ratings;
      delete ret.score;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});
RecipeSchema.plugin(mongoosePagination);

RecipeSchema.index({
  name: 'text',
  description: 'text',
  'recipes.ingredient': 'text',
}, {
  weights: {
    name: 10,
    description: 2,
    'recipes.ingredient': 5,
  }
});

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
  const recipe = this as IRecipe;
  if (!recipe.ratings.includes(ratingId)) {
    recipe.ratings.push(ratingId);
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

RecipeSchema.statics.getRecipesByCategory = async function (category:string) {
  return await Recipe.find({category}).exec();
}

export const RecipeModel = model<IRecipe, IRecipeModel>('recipe', RecipeSchema);

export const Recipe = RecipeModel;


