import { Router } from "express";

type Wrapper = (router: Router) => void;

export const applyMiddleware = (
  middleware: Wrapper[],
  router: Router,
) => {
  for (const middle of middleware) {
    middle(router);
  }
};

