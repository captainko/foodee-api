import * as express from 'express';

import { RecipeRouter } from "./recipe.router";
import { UserRouter } from './user.router';
import { CategoryRouter } from './category.router';
import { ImageRouter } from './image.router';
import { MainFrameRouter } from './main-frame.router';
import { SearchRouter } from './search.router';
import { CollectionRouter } from './collection.router';

const api = express();
export class Routes {
    public static routes(app: express.Application): void {
        app.use('/api/v1', api);
        api.use('/recipe', RecipeRouter)
            .use('/category', CategoryRouter)
            .use('/collection', CollectionRouter)
            .use('/upload-image', ImageRouter)
            .use('/user', UserRouter)
            .use('/main-frame', MainFrameRouter)
            .use('/search', SearchRouter);

    }
}
