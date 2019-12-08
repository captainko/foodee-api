
import loadPage from './commands/load-page';

export default function(router) {
  router.get('/reset-password', loadPage);

  return router;
}
