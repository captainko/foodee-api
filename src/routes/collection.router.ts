//lib
import { Router } from "express";
//app
import { auth } from "./auth";
import { CollectionController } from '@controllers/collection.controller';

const router = Router();

router.all('*').param('collection', CollectionController.preloadCollection);
router.post('/', auth.required, CollectionController.createCollection);

router.get('/:collection', auth.required, CollectionController.getCollection);
router.put('/:collection', auth.required, CollectionController.updateCollection);

export const CollectionRouter = router;