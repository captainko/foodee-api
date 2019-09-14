import { Schema, model, SchemaTypes, Document } from 'mongoose';
import { Recipe, RecipeModel } from './recipe.model';
import { UserModel } from './user.model';

export interface IRating extends Document {
  recipeId?: String;
  userId?: String;
  rateValue?: Number;
}

export const RatingSchema = new Schema({
  recipeId: {
    type: SchemaTypes.ObjectId,
    ref: 'recipe',
    required: true,
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
  rateValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

RatingSchema.post('save', async function (doc: IRating) {
  let recipe = await Recipe.findOne({ _id: doc.recipeId, recipes: { $nin: [doc._id] } }).exec();
  if (recipe) {
    recipe.ratings.push(doc._id);
    await recipe.save();
  }

  console.log(recipe);
});

RatingSchema.methods.rate = async function (userId: string, recipeId: string, rateValue: number) {
  let ratingObj = await Rating.findOne({ userId: userId, recipe: recipeId}).exec();

  // user already rated;
  if(ratingObj) {
    ratingObj.rateValue = rateValue;
  } else {
    ratingObj = new Rating({
      userId,
      recipeId,
      rateValue
    });
  }

  return await ratingObj.save();
}

// validate


export const RatingModel = model<IRating>('rating', RatingSchema);
export const Rating = RatingModel;