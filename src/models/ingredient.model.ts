import {Schema, model, Document} from "mongoose";

export interface IIngredient extends Document {
  name?: string;
  image_url?: string;
  create_date?: string;
}

export const IngredientSchema = new Schema({
  name: String,
  image_url: String,
  created_date: {
    type: Date,
    default: Date.now,
  }
});

export const IngredientModel = model<IIngredient>('ingredient', IngredientSchema);

export const Ingredient = IngredientModel;
