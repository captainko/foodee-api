
import { loadPage } from "./commands/load-page";
import { Router } from 'express';

export default (router: Router) => {
  router.get('/reset-password-success', loadPage);
  return router;
};
