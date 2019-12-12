
import { loadPage } from "./commands/load-page";
import { Router } from 'express';
import { verifiedUser } from "./commands/verified-user";
import { submitPassword } from "./commands/submit-password";

module.exports = (router: Router) => {
  router.all("*").param('token', verifiedUser);

  router.get('/reset-password/:token', loadPage);
  router.post('/reset-password/:token', submitPassword);

  return router;
};
