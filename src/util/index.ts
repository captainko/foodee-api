import { Router } from "express";
import cloudinary = require("cloudinary");

type Wrapper = (router: Router) => void;

export const applyMiddleware = (
  middleware: Wrapper[],
  router: Router,
) => {
  for (const middle of middleware) {
    middle(router);
  }
};

export const checkIfExists = cloudinary.v2.api.resource;
