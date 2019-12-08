import { Schema, model, SchemaTypes, Document, Model } from 'mongoose';

export interface IAdminRating extends Document {
  _id: string;
  recipeId?: string;
  userId?: string;
  rateValue?: number;
}
export const AdminRatingFields = {
  recipeId: {
    type: SchemaTypes.ObjectId,
    ref: 'admin-recipe',
    required: true,
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'admin-user',
    required: true,
  },
  rateValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
};

export const AdminRatingSchema = new Schema(AdminRatingFields);

export interface IAdminRatingModel extends Model<IAdminRating> {
  rate: (userId: string, recipeId: string, rateValue: number) => Promise<IAdminRating>;
}

AdminRatingSchema.statics.rate = async function(userId: string, recipeId: string, rateValue: number) {
  let ratingObj = await AdminRating.findOne({ userId, recipeId }).exec();
  // user already rated;
  if (ratingObj) {
    ratingObj.rateValue = rateValue;
  } else {
    ratingObj = new AdminRating({
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
    ref: 'admin-recipe',
  },
  avgRating: Number
};

export const RatingResultSchema = new Schema(
  RatingResultFields, {
  timestamps: false,
  versionKey: false,
});

// validate
export const AdminRatingModel = model<IAdminRating, IAdminRatingModel>('admin-rating', AdminRatingSchema, 'ratings');
export const AdminRating = AdminRatingModel;
export const AdminRatingResultModel = model<IRatingResult>('admin-rating-result', RatingResultSchema, 'rating-results');
export const AdminRatingResult = AdminRatingResultModel;