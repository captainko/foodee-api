import { model, Schema } from "mongoose";
import {
  UserFields,
  RecipeFields,
  RatingFields,
  CollectionFields,
  ImageFields,
  RatingResultFields
} from "../../models";
UserFields.image_url.ref = 'admin-image';
// export * from '../../src/models';

UserFields.savedRecipes.type[0].ref = 'admin-recipe';
UserFields.ratings.type[0].ref = 'admin-rating';
// UserFields.createdRecipes.type[0].ref = 'admin-recipe';
// UserFields.collections.type[0].ref = 'admin-collection';
// @ts-ignore
RecipeFields.banners.type[0].ref = 'admin-image';
// @ts-ignore
RecipeFields.createdBy.ref = 'admin-user';
// RecipeFields.ratings.type[0].ref = 'admin-rating';

RatingFields.userId.ref = 'admin-user';
RatingFields.recipeId.ref = 'admin-recipe';
CollectionFields.createdBy.ref = 'admin-user';
CollectionFields.recipes.type[0].ref = 'admin-recipe';
RatingResultFields._id.ref = 'admin-recipe';

const AdminUserSchema = new Schema(UserFields);
AdminUserSchema.virtual('collections', {
  ref: 'admin-collection',
  localField: '_id',
  foreignField: 'createdBy',
  options: { sort: { updatedAt: -1 } },
});

AdminUserSchema.virtual('createdRecipes', {
  ref: 'admin-recipe',
  localField: '_id',
  foreignField: 'createdBy',
  options: { sort: { updatedAt: -1 } },
});

export const User = model('admin-user', AdminUserSchema, 'users');
export const Image = model('admin-image', ImageFields as any, 'images');
export const Recipe = model('admin-recipe', RecipeFields as any, 'recipes');
export const Rating = model('admin-rating', RatingFields as any, 'recipes');
export const RatingResult = model('admin-rating-result', RatingResultFields as any, 'rating-results');
export const Collection = model('admin-collection', CollectionFields as any, 'collections');

