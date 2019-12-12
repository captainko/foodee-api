
const loadPage = require('./commands/load-page');

module.exports = router => {
  router.get('/verified-account', loadPage);

  return router;
};
