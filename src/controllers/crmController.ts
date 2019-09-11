import * as mongoose from 'mongoose';

import { Request, Response } from 'express';
import { ContactSchema } from '../models/crmModel';

const Contact = mongoose.model('Contact', ContactSchema);
export class ContactController {

  public getContacts(req: Request, res: Response) {
    Contact.find({})
      .then((contact) => res.json(contact))
      .catch((err) => res.send(err));
  }

  public getContactWithID(req: Request, res: Response) {
    Contact.findById(req.params.contactId)
      .then((contact) => res.json(contact))
      .catch((err) => res.json(err));
  }

  public addNewContact(req: Request, res: Response) {
    const newContact = new Contact(req.body);

    newContact.save((err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  }
}
