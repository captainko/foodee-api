import { Schema, model, Document, SchemaTypes } from "mongoose";
import { IIngredient } from "./ingredient.model";

export interface IRecipe extends Document {
  name?: string;
  description?: string;
  time?: string;
  banners?: string[];
  ingredients?: [{ quantity: string, ingredient: IIngredient }];
  rating: Number;
  ratings: [{
    type: Schema.Types.ObjectId,
    ref: "rating",
  }]
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
  ingredients: [{
    quantity: String,
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'ingredient'
    }
  }],
  ratings: {
    type: SchemaTypes.ObjectId,
    ref: 'rating',
  },
  created_date: {
    type: Date,
    default: Date.now,
  }
}, {
  versionKey: false,
});

RecipeSchema.virtual('rating').get(function() {
  return this.ratings.length;
});

export const RecipeModel = model<IRecipe>('recipe', RecipeSchema);

export const Recipe = RecipeModel;


