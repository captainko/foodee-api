import { Schema, model, SchemaTypes, Document } from 'mongoose';
import { Recipe } from './recipe.model';

export interface IRating extends Document {
  recipeId?: String;
  userId?: String;
  rating?: Number;
}

export const RatingSchema = new Schema<IRating>({
  recipeId: {
    type: SchemaTypes.ObjectId,
    ref: 'recipe',
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

RatingSchema.post('save', async function(doc: IRating) {
  let recipe = Recipe.find({_id: doc.recipeId});
  console.log(recipe);
});

export const RatingModel = model('rating', RatingSchema);
export const Rating = RatingModel;