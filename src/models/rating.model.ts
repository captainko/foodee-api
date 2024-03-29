import { Schema, model, SchemaTypes, Document, version, Model } from 'mongoose';
import { Recipe } from './recipe.model';

export interface IRating extends Document {
  _id: string;
  recipeId?: string;
  userId?: string;
  rateValue?: number;
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
}, {
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

export interface RatingModel extends Model<IRating> {
  rate: (userId: string, recipeId: string, rateValue: number) => IRating;
}

RatingSchema.statics.rate = async function (userId: string, recipeId: string, rateValue: number) {
  let ratingObj = await Rating.findOne({ userId, recipeId }).exec();
  console.log(ratingObj);
  // user already rated;
  if (ratingObj) {
    ratingObj.rateValue = rateValue;
  } else {
    ratingObj = new Rating({
      userId,
      recipeId,
      rateValue,
    });
  }

  return await ratingObj.save();
}

export interface IRatingResult extends Document {
  _id: string;
  rating: {
    avgRating: number;
    totalRating: number;
  }
}
export const RatingResultSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'recipe',
  },
  avgRating: Number
}, {
  timestamps: false,
  versionKey: false,
})

// validate


export const RatingModel = model<IRating, RatingModel>('rating', RatingSchema);
export const Rating = RatingModel;
export const RatingResultModel = model<IRatingResult>('ratingResult', RatingResultSchema);
export const RatingResult = RatingResultModel;