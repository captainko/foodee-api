import { Schema, model, Document, SchemaTypes } from "mongoose";
import { IIngredient } from "./ingredient.model";
import { Rating } from "./rating.model";

export interface IRecipe extends Document {
  name?: string;
  description?: string;
  time?: string;
  banners?: string[];
  ingredients?: [{ quantity: string, ingredient: IIngredient }];
  rating?: Number;
  ratings:string[],
  created_date?: string;
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
      ingredient: {
        type: Schema.Types.ObjectId,
        ref: 'ingredient'
      }
    }],
    default: [],
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
});

RecipeSchema.virtual('rating').get(function () {
  return this.ratings.length as Number;
});

RecipeSchema.methods.addRating = async function (ratingId: string) {
  const recipe = this as IRecipe;
  if(!recipe.ratings.includes(ratingId)) {
    recipe.ratings.push(ratingId);
  }
}

export const RecipeModel = model<IRecipe>('recipe', RecipeSchema);

export const Recipe = RecipeModel;


