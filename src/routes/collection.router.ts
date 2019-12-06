// lib
import { Router } from "express";
// app
import { auth } from "./auth";
import { CollectionController as CollectionCtrl } from '../controllers/collection.controller';

const router = Router();

router.all('*')
  .param('collection', CollectionCtrl.preloadCollection)
  .param('recipe', CollectionCtrl.preloadRecipe);
router.post('/', auth.required, CollectionCtrl.createCollection)
      .get('/:collection', auth.required, CollectionCtrl.getCollection)
      .post('/:collection', auth.required, CollectionCtrl.onlySameUserOrAdmin, CollectionCtrl.updateCollection)
      .delete('/:collection', auth.required, CollectionCtrl.onlySameUserOrAdmin, CollectionCtrl.deleteCollection)
      .post('/:collection/add/:recipe', auth.required, CollectionCtrl.onlySameUserOrAdmin, CollectionCtrl.addRecipe)
// tslint:disable-next-line: max-line-length
      .post('/:collection/remove/:recipe', auth.required, CollectionCtrl.onlySameUserOrAdmin, CollectionCtrl.removeRecipe);
export const CollectionRouter = router;