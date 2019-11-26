import { Rating, RatingResult } from "../models";

export const RatingResource = {
  resource: Rating,
  options: {
    name: 'Ratings',
  }
};

export const RatingResultResource = {
  resource: RatingResult,
  options: {
    name: 'Rating Results',
    isVisible: false,
  }
};