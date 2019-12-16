import { model, Schema } from "mongoose";
import {
  UserFields,
  RecipeFields,
  RatingFields,
  CollectionFields,
  ImageFields,
  RatingResultFields
} from "../../../../models";
import { AdminUserSchema } from "./admin-user.model";
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

export const User = model('admin-user', UserFields as any, 'users');
export const Image = model('admin-image', ImageFields as any, 'images');
export const Recipe = model('admin-recipe', RecipeFields as any, 'recipes');
export const Rating = model('admin-rating', RatingFields as any, 'recipes');
export const RatingResult = model('admin-rating-result', RatingResultFields as any, 'rating-results');
export const Collection = model('admin-collection', CollectionFields as any, 'collections');

