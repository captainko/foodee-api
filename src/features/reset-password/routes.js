
const loadPage = require('./commands/load-page');

module.exports = router => {
  router.get('/reset-password', loadPage);

  return router;
};
