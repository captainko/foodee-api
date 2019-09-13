import { Document, Schema, model} from "mongoose";
import { IngredientSchema, IIngredient } from "./ingredient.model";

export interface IUser extends Document {
  name?: string;
  image_url?: string;
  recipes?: IIngredient[];
  created_date?: string;
}

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    trim: true,
  },
  image_url: String,
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'recipe'
  }],
  created_date: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

export const UserModel = model<IUser>('user', UserSchema);
export const User = UserModel;