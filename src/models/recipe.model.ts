import { Schema, model, Document, SchemaTypes, Model } from "mongoose";
import { Rating, IRating } from "./rating.model";

export interface IRecipe extends Document {
  name?: string;
  description?: string;
  time?: string;
  banners?: string[];
  ingredients?: [{ quantity: string, ingredient: string }];
  totalRating: number;
  isRated: boolean | number;
  ratings?: string[],
  createdDate?: string;
  updatedDate?: string;

  addRating: (ratingId: string) => IRating;
  updateRating: () => Promise<any>;

}

export interface IRecipeModel extends Model<IRecipe> {
}

export const RecipeSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  time: {
    type: String,
    trim: true,
  },
  banners: [String],
  ingredients: {
    type: [{
      quantity: String,
      ingredient: String,
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
  // results = results.map(x => {
  //   x.rating = {
  //     avgRating: x.avgRating,
  //     totalRating: x.totalRating,
  //   }
  // });
  delete results[0]._id;
  this.rating = results[0];
  await this.save();
  return this;
};

RecipeSchema.methods.addRating = function (ratingId: string) {
  const recipe = this as IRecipe;
  if (!recipe.ratings.includes(ratingId)) {
    recipe.ratings.push(ratingId);
  }

  return this;
}

export const RecipeModel = model<IRecipe, IRecipeModel>('recipe', RecipeSchema);

export const Recipe = RecipeModel;


