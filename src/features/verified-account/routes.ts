
// import loadPage = require('./commands/load-page');
import { loadPage } from "./commands/load-page";
import { Router } from "express";

export default (router: Router) => {
  router.get('/verified-account/', loadPage);

  return router;
};
