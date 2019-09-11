import { Request, Response, Application} from "express";
import * as path from "path";

import { ContactController } from "../controllers/crmController";

export class Routes {
    private contactCtrl = new ContactController();

    public routes(app: Application): void {
        app.route("/")
            .get((req: Request, res: Response) => {
                // res.status(200).send({
                //     msg: "GET request successfully"
                // });
                res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
            });

        app.route('/contact')
            .get(this.contactCtrl.getContacts)
            .post(this.contactCtrl.addNewContact);
        app.route('/contact/:contactId')
            .get(this.contactCtrl.getContactWithID);
    }
}
