import * as express from 'express';

import { RecipeRouter } from "./recipe.router";
import { UserRouter } from './user.router';
import { CategoryRouter } from './category.router';
import { ImageRouter } from './image.router';
import { MainFrameRouter } from './main-frame.router';

const api = express();
export class Routes {
    public static routes(app: express.Application): void {
        app.use('/api/v1', api);
        // app.route("/")
        //     .get((req: Request, res: Response) => {
        //         // res.status(200).send({
        //         //     msg: "GET request successfully"
        //         // });
        //         res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
        //     });

        // app.route('/contact')
        //     .get(this.contactCtrl.getContacts)
        //     .post(this.contactCtrl.addNewContact);
        // app.route('/contact/:contactId')
        //     .get(this.contactCtrl.getContactWithID);
        api.use('/recipe', RecipeRouter);
        api.use('/category', CategoryRouter);
        api.use('/upload-image', ImageRouter);
        api.use('/user', UserRouter);
        api.use('/main-frame', MainFrameRouter)
    }
}
