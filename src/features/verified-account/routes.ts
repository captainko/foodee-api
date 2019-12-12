
// import loadPage = require('./commands/load-page');
import { loadPage } from "./commands/load-page";
import { Router } from "express";

module.exports = (router: Router) => {
  router.get('/verified-account/', loadPage);

  return router;
};
