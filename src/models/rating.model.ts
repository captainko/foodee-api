import { Schema, model, SchemaTypes, Document, Model } from 'mongoose';

export interface IRating extends Document {
  _id: string;
  recipeId?: string;
  userId?: string;
  rateValue?: number;
}
export const RatingFields = {
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
};

export const RatingSchema = new Schema(
  RatingFields,
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // ret.id = ret._id;
        delete ret._id;
        delete ret.ratings;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        // ret.id = ret._id;
        delete ret._id;
      }
    }
  });

export interface IRatingModel extends Model<IRating> {
  rate: (userId: string, recipeId: string, rateValue: number) => Promise<IRating>;
}

RatingSchema.statics.rate = async function(userId: string, recipeId: string, rateValue: number) {
  let ratingObj = await Rating.findOne({ userId, recipeId }).exec();
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
};

export interface IRatingResult extends Document {
  _id: string;
  rating: {
    avgRating: number;
    totalRating: number;
  };
}

export const RatingResultFields = {
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'recipe',
  },
  avgRating: Number
};

export const RatingResultSchema = new Schema(
  RatingResultFields, {
  timestamps: false,
  versionKey: false,
});

// validate
export const RatingModel = model<IRating, IRatingModel>('rating', RatingSchema);
export const Rating = RatingModel;
export const RatingResultModel = model<IRatingResult>('ratingResult', RatingResultSchema);
export const RatingResult = RatingResultModel;